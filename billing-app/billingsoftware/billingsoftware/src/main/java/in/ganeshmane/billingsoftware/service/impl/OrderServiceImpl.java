package in.ganeshmane.billingsoftware.service.impl;

import com.razorpay.Order;
import in.ganeshmane.billingsoftware.entity.OrderEntity;
import in.ganeshmane.billingsoftware.entity.OrderItemEntity;
import in.ganeshmane.billingsoftware.io.*;
import in.ganeshmane.billingsoftware.repository.OrderEntityRepository;
import in.ganeshmane.billingsoftware.service.OrderService;
import lombok.Builder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import java.awt.print.Pageable;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderEntityRepository orderEntityRepository;

    @Autowired
    public OrderServiceImpl(OrderEntityRepository orderEntityRepository) {
        this.orderEntityRepository = orderEntityRepository;
    }

    @Override
    public OrderResponse createOrder(OrderRequest request) {
        // Convert OrderRequest to OrderEntity
        OrderEntity orderEntity = convertToOrderEntity(request);
        System.out.println(orderEntity);
        // Set payment details
        PaymentDetails paymentDetails = new PaymentDetails();
        if (request.getPaymentMethod() == PaymentMethod.CASH) {
            paymentDetails.setPaymentStatus(PaymentDetails.PaymentStatus.COMPLETED);
        } else {
            paymentDetails.setPaymentStatus(PaymentDetails.PaymentStatus.PENDING);
        }

        orderEntity.setPaymentDetails(paymentDetails);

        if (request.getCartItems() == null || request.getCartItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart items cannot be empty");
        }

        // Convert cart items
        List<OrderItemEntity> orderItems = request.getCartItems().stream()
                .map(this::convertToOrderItemEntity)
                .collect(Collectors.toList());
        orderEntity.setItems(orderItems);

        // Save order
        OrderEntity savedOrder = orderEntityRepository.save(orderEntity);

        // Convert to response
        return convertToOrderResponse(savedOrder);
    }

    @Override
    public void deleteOrder(String orderId) {
            try{
                OrderEntity orderEntity = orderEntityRepository.findByOrderId(orderId).orElseThrow(()->new UsernameNotFoundException("No Order found at orderId : "+orderId));
                orderEntityRepository.delete(orderEntity);
            }catch (Exception e){
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while deleting order", e);
            }
    }

    @Override
    public List<OrderResponse> allOrders() {
        try{
        List<OrderEntity> orderEntityList = orderEntityRepository.findAllWithItems();
        return orderEntityList.stream().map(this::convertToOrderResponse).collect(Collectors.toList());
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error while Fetching orders", e);
        }
    }



    @Override
    public OrderResponse verifyPayment(PaymentVerificationRequest request) {
        OrderEntity existingOrder = orderEntityRepository.findByOrderId(request.getOrderId()).orElseThrow(()-> new RuntimeException("Order Not found."));
        if(!verifyRazorpaySignature(request.getRazorpaySignature(),request.getRazorpayPaymentId(),request.getRazorpayOrderId())){
            throw new RuntimeException("Payment Verification Failed..!!");
        }
        PaymentDetails paymentDetails = existingOrder.getPaymentDetails();
        paymentDetails.setRazorpayOrderId(request.getRazorpayOrderId());
        paymentDetails.setRazorpayPaymentId(request.getRazorpayPaymentId());
        paymentDetails.setRazorpaySignature(request.getRazorpaySignature());
        paymentDetails.setPaymentStatus(PaymentDetails.PaymentStatus.COMPLETED);
        existingOrder = orderEntityRepository.save(existingOrder);
        return convertToOrderResponse(existingOrder);
    }

    @Override
    public Double sumSalesByDate(LocalDate date) {
        return orderEntityRepository.sumSalesByDate(date);
    }

    @Override
    public Long countByOrderDate(LocalDate date) {
        return orderEntityRepository.countByOrderDate(date);
    }

    @Override
    public List<OrderResponse> findRecentOrders() {
        return orderEntityRepository.findRecentOrders(PageRequest.of(0,5))
                .stream().map(orderEntity -> {
                    return convertToOrderResponse(orderEntity);
                })
                .collect(Collectors.toList());

    }

    private boolean verifyRazorpaySignature(String razorpaySignature,String razorpayPaymentId,String orderId){
        return true;
    }

    // Converts OrderRequest to OrderEntity
    private OrderEntity convertToOrderEntity(OrderRequest orderRequest) {
        return OrderEntity.builder()
                .customerName(orderRequest.getCustomerName())
                .phoneNumber(orderRequest.getPhoneNumber())
                .subtotal(orderRequest.getSubTotal())
                .tax(orderRequest.getTax())
                .grandTotal(orderRequest.getGrandTotal())
                .paymentMethod(orderRequest.getPaymentMethod())
                .createdAt(LocalDateTime.now())
                .build();
    }

    // Converts OrderItemRequest to OrderItemEntity
    private OrderItemEntity convertToOrderItemEntity(OrderRequest.OrderItemRequest orderItemRequest) {
        return OrderItemEntity.builder()
                .itemId(orderItemRequest.getItemId())
                .name(orderItemRequest.getName())
                .price(orderItemRequest.getPrice())
                .quantity(orderItemRequest.getQuantity())
                .build();
    }


    // Converts OrderEntity to OrderResponse
    private OrderResponse convertToOrderResponse(OrderEntity entity) {
        List<OrderResponse.OrderItemResponse> items = entity.getItems().stream()
                .map(this::convertToOrderItemResponse)
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .orderId(entity.getOrderId())
                .customerName(entity.getCustomerName())
                .phoneNumber(entity.getPhoneNumber())
                .subTotal(entity.getSubtotal())
                .tax(entity.getTax())
                .grandTotal(entity.getGrandTotal())
                .paymentMethod(entity.getPaymentMethod())
                .paymentDetails(entity.getPaymentDetails())
                .createdAt(entity.getCreatedAt())
                .items(items)
                .build();
    }

    // Converts OrderItemEntity to OrderItemResponse
    private OrderResponse.OrderItemResponse convertToOrderItemResponse(OrderItemEntity orderItemEntity) {
        return OrderResponse.OrderItemResponse.builder()
                .itemId(orderItemEntity.getItemId())
                .name(orderItemEntity.getName())
                .price(orderItemEntity.getPrice())
                .quantity(orderItemEntity.getQuantity())
                .build();
    }
}

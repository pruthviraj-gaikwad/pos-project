package in.ganeshmane.billingsoftware.service;

import com.razorpay.Order;
import in.ganeshmane.billingsoftware.io.OrderRequest;
import in.ganeshmane.billingsoftware.io.OrderResponse;
import in.ganeshmane.billingsoftware.io.PaymentVerificationRequest;

import java.awt.print.Pageable;
import java.time.LocalDate;
import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
     void deleteOrder(String orderId);
     List<OrderResponse> allOrders();
     OrderResponse verifyPayment(PaymentVerificationRequest request);
    Double sumSalesByDate(LocalDate date);
    Long countByOrderDate(LocalDate date);
    List<OrderResponse> findRecentOrders();
}

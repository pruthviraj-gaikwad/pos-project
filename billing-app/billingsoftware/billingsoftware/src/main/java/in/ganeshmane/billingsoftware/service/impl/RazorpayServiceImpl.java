package in.ganeshmane.billingsoftware.service.impl;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import in.ganeshmane.billingsoftware.io.OrderRequest;
import in.ganeshmane.billingsoftware.io.RazorpayOrderResponse;
import in.ganeshmane.billingsoftware.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RazorpayServiceImpl implements RazorpayService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    @Override
    public RazorpayOrderResponse createOrder(Integer amount, String currency) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId,razorpayKeySecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount",amount);
        orderRequest.put("currency",currency);
        orderRequest.put("receipt","ord_"+UUID.randomUUID().toString());
        orderRequest.put("payment_capture",1);
        Order order = razorpayClient.orders.create(orderRequest);
        return convertToResponse(order);
    }

    private RazorpayOrderResponse convertToResponse(Order order) {
        return RazorpayOrderResponse.builder()
                .id(order.get("id").toString())
                .entity(order.get("entity").toString())
                .amount(order.get("amount").toString())  // cast safely
                .currency(order.get("currency").toString())
                .status(order.get("status").toString())
                .created_at(order.get("created_at"))
                .receipt(order.get("receipt").toString())
                .build();
    }



}

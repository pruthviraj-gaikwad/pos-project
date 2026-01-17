package in.ganeshmane.billingsoftware.service;

import com.razorpay.RazorpayException;
import in.ganeshmane.billingsoftware.io.RazorpayOrderResponse;

public interface RazorpayService {
    RazorpayOrderResponse createOrder(Integer amount, String currency) throws RazorpayException;
}

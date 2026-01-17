package in.ganeshmane.billingsoftware.controller;

import in.ganeshmane.billingsoftware.service.impl.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/otp")
@RequiredArgsConstructor
public class OtpController {
    private final OtpService otpService;
    private final Map<String,String> otpStore = new HashMap<>();

    @PostMapping("/send")
    public Map<String,String> sendOtp(@RequestBody Map<String,String> payload){
        String phone = payload.get("phoneNumber");
        String otp   = otpService.sendOtp(phone);
        otpStore.put(phone,otp);
        return Map.of("message","OTP sent successfully");
    }

    @PostMapping("/verify")
    public Map<String,Object> verifyOtp(@RequestBody Map<String,String> payload){
        String phone = payload.get("phoneNumber");
        String otp = payload.get("otp");
        boolean success = otpStore.containsKey(phone) && otpStore.get(phone).equals(otp);
        if(success){
            otpStore.remove(phone);
        }
        return Map.of("success",success);
    }
}

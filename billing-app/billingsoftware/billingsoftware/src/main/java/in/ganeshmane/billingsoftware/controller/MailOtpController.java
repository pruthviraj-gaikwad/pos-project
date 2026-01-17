package in.ganeshmane.billingsoftware.controller;

import in.ganeshmane.billingsoftware.service.impl.EmailOtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/email/otp")
public class MailOtpController {

    private final EmailOtpService emailOtpService;

    // ✅ Send OTP Endpoint
    @PostMapping("/send")
    public String sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email address");
        }

        String otp = emailOtpService.sendOtpMail(email);
        return "OTP sent to email: " + email;
    }

    // ✅ Verify OTP Endpoint
    @PostMapping("/verify")
    public String verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        System.out.println(email);
        System.out.println(otp);
        boolean valid = emailOtpService.verifyOtp(email, otp);
        return valid ? "OTP Verified ✅" : "Invalid OTP ❌";
    }

    // ✅ Email Validator
    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }
}

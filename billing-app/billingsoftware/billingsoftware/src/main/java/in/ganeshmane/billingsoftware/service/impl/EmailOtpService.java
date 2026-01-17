package in.ganeshmane.billingsoftware.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailOtpService {
    private  final JavaMailSender mailSender;
    private final Random random = new Random();
    private final Map<String,String> mailOtpStore= new HashMap<>();
    public String sendOtpMail(String email){
        String otp = String.format("%06d", random.nextInt(999999));
        mailOtpStore.put(email,otp);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("BILLING APP OTP CODE");
        message.setText("Your OTP is "+otp+"\n It is valid for 5 minutes.");
        mailSender.send(message);
        return otp;
    }

    public boolean verifyOtp(String email,String inputOtp){
        return mailOtpStore.containsKey(email) && mailOtpStore.get(email).equals(inputOtp);
    }

}

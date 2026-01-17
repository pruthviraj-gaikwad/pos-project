package in.ganeshmane.billingsoftware.service.impl;

import com.twilio.Twilio;
import com.twilio.type.PhoneNumber;
import com.twilio.rest.api.v2010.account.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class OtpService {

    private final String fromPhone;
    private final Random random = new Random();

    public OtpService(
            @Value("${twilio.account.sid}") String accountSid,
            @Value("${twilio.auth.token}") String authToken,
            @Value("${twilio.phone.number}") String fromPhone
    ) {
        Twilio.init(accountSid, authToken);
        this.fromPhone = fromPhone;
    }

    public String sendOtp(String phoneNumber) {
        if (!phoneNumber.startsWith("+91")) {
            throw new IllegalArgumentException("Phone must be in E.164 format.");
        }
        String otp = String.valueOf(random.nextInt(900000) + 100000);
        Message.creator(
                new PhoneNumber(phoneNumber),
                new PhoneNumber(fromPhone),
                "Your OTP is: " + otp
        ).create();
        return otp;
    }
}

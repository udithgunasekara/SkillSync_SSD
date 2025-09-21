package BackEnd.service;

import org.springframework.stereotype.Service;

public interface OTPService {
    void generateAndSendOtp(String email);
    boolean verifyOtp(String email, String otp);
}

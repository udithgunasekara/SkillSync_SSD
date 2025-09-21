package BackEnd.service.imple;

import BackEnd.entity.OTPRequest;
import BackEnd.repository.OTPRequestRepo;
import BackEnd.service.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Random;

@Service
public class OTPServiceImpl implements OTPService {
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private OTPRequestRepo otpRequestRepo;
    @Override
    public void generateAndSendOtp(String email) {
        String otp = String.format("%04d", new Random().nextInt(10000));
        OTPRequest user = new OTPRequest();
       // user.setId(85);
        user.setEmail(email);
        user.setOtp(otp);
        otpRequestRepo.save(user);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP");
        message.setText("OTP for verification is: " + otp);
        mailSender.send(message);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        OTPRequest user = otpRequestRepo.findByEmail(email).orElse(null);
        if (user != null && user.getOtp().equals(otp)) {
            return true;
        }
        return false;
    }
}


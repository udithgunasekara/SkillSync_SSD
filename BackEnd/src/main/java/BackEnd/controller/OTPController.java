package BackEnd.controller;

import BackEnd.DTO.OTPRequestDTO;
import BackEnd.service.OTPService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/otp")
public class OTPController {

    @Autowired
    private OTPService otpService;

    @PostMapping("/request")
    public ResponseEntity<?> requestOtp(@RequestBody OTPRequestDTO otpDTO) {
        otpService.generateAndSendOtp(otpDTO.getEmail());
        return ResponseEntity.ok("OTP sent to " + otpDTO.getEmail());
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody OTPRequestDTO otpDTO) {
        boolean isValid = otpService.verifyOtp(otpDTO.getEmail(), otpDTO.getOtp());
        if (isValid) {
            return ResponseEntity.ok("OTP verified successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
    }
}

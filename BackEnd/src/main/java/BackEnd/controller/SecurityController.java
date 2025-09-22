package BackEnd.controller;

import BackEnd.service.LoginAttemptService;
import BackEnd.entity.LoginAttempt;
import BackEnd.repository.LoginAttemptRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@AllArgsConstructor
@RestController
@CrossOrigin
@RequestMapping(path = "/Security")
public class SecurityController {
    
    private LoginAttemptService loginAttemptService;
    private LoginAttemptRepository loginAttemptRepository;
    
    @GetMapping("/login-status/{username}")
    public ResponseEntity<Map<String, Object>> getLoginStatus(@PathVariable String username, HttpServletRequest request) {
        String clientIp = loginAttemptService.getClientIpAddress(request);
        Optional<LoginAttempt> attempt = loginAttemptRepository.findByIpAddressAndUsername(clientIp, username);
        
        Map<String, Object> status = new HashMap<>();
        status.put("ipAddress", clientIp);
        status.put("username", username);
        
        if (attempt.isPresent()) {
            LoginAttempt loginAttempt = attempt.get();
            status.put("attemptCount", loginAttempt.getAttemptCount());
            status.put("isBlocked", loginAttempt.isBlocked());
            status.put("lastAttempt", loginAttempt.getLastAttempt());
            status.put("blockedUntil", loginAttempt.getBlockedUntil());
        } else {
            status.put("attemptCount", 0);
            status.put("isBlocked", false);
            status.put("lastAttempt", null);
            status.put("blockedUntil", null);
        }
        
        return ResponseEntity.ok(status);
    }
    
    @DeleteMapping("/clear-attempts/{username}")
    public ResponseEntity<String> clearAttempts(@PathVariable String username, HttpServletRequest request) {
        String clientIp = loginAttemptService.getClientIpAddress(request);
        loginAttemptService.resetAttempts(clientIp, username);
        return ResponseEntity.ok("Attempts cleared for " + username + " from " + clientIp);
    }
}
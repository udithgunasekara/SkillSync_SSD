package BackEnd.service;

import BackEnd.entity.LoginAttempt;
import BackEnd.repository.LoginAttemptRepository;
import BackEnd.Config.RateLimitConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class LoginAttemptService {
    
    @Autowired
    private LoginAttemptRepository loginAttemptRepository;
    
    @Autowired
    private RateLimitConfig rateLimitConfig;
    
    public boolean isBlocked(String ipAddress, String username) {
        Optional<LoginAttempt> attempt = loginAttemptRepository.findByIpAddressAndUsername(ipAddress, username);
        
        if (attempt.isPresent()) {
            LoginAttempt loginAttempt = attempt.get();
            
            if (loginAttempt.isBlocked() && loginAttempt.getBlockedUntil().isAfter(LocalDateTime.now())) {
                return true;
            }
            
            if (loginAttempt.isBlocked() && loginAttempt.getBlockedUntil().isBefore(LocalDateTime.now())) {
                clearAttempts(ipAddress, username);
            }
        }
        
        return false;
    }
    
    @Transactional
    public void recordFailedAttempt(String ipAddress, String username) {
        Optional<LoginAttempt> existingAttempt = loginAttemptRepository.findByIpAddressAndUsername(ipAddress, username);
        
        if (existingAttempt.isPresent()) {
            LoginAttempt attempt = existingAttempt.get();
            attempt.setAttemptCount(attempt.getAttemptCount() + 1);
            attempt.setLastAttempt(LocalDateTime.now());
            
            if (attempt.getAttemptCount() >= rateLimitConfig.getMaxAttempts()) {
                attempt.setBlocked(true);
                attempt.setBlockedUntil(LocalDateTime.now().plusMinutes(rateLimitConfig.getBlockDurationMinutes()));
            }
            
            loginAttemptRepository.save(attempt);
        } else {
            LoginAttempt newAttempt = new LoginAttempt();
            newAttempt.setIpAddress(ipAddress);
            newAttempt.setUsername(username);
            newAttempt.setAttemptCount(1);
            newAttempt.setLastAttempt(LocalDateTime.now());
            newAttempt.setBlockedUntil(LocalDateTime.now());
            newAttempt.setBlocked(false);
            
            loginAttemptRepository.save(newAttempt);
        }
    }
    
    @Transactional
    public void resetAttempts(String ipAddress, String username) {
        loginAttemptRepository.findByIpAddressAndUsername(ipAddress, username)
            .ifPresent(loginAttemptRepository::delete);
    }
    
    @Transactional
    public void clearAttempts(String ipAddress, String username) {
        Optional<LoginAttempt> attempt = loginAttemptRepository.findByIpAddressAndUsername(ipAddress, username);
        
        if (attempt.isPresent()) {
            LoginAttempt loginAttempt = attempt.get();
            loginAttempt.setAttemptCount(0);
            loginAttempt.setBlocked(false);
            loginAttempt.setBlockedUntil(LocalDateTime.now());
            loginAttemptRepository.save(loginAttempt);
        }
    }
    
    public String getClientIpAddress(jakarta.servlet.http.HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
package BackEnd.controller;

import BackEnd.DTO.LoginDTO;
import BackEnd.DTO.AuthResponse;
import BackEnd.Config.JwtUtil;
import BackEnd.service.LoginAttemptService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@CrossOrigin
@RequestMapping(path = "/Admin")
public class AdminController {
    
    private JwtUtil jwtUtil;
    private LoginAttemptService loginAttemptService;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDTO loginDTO, HttpServletRequest request, HttpServletResponse response) {
        String clientIp = loginAttemptService.getClientIpAddress(request);
        
        if (loginAttemptService.isBlocked(clientIp, loginDTO.getUsername())) {
            return ResponseEntity.status(429).body(new AuthResponse("Too many failed attempts. Please try again after 15 minutes.", null));
        }
        
        // Simple hardcoded admin validation (replace with proper authentication)
        if ("admin".equals(loginDTO.getUsername()) && "admin123".equals(loginDTO.getPassword())) {
            loginAttemptService.resetAttempts(clientIp, loginDTO.getUsername());
            
            String token = jwtUtil.generateToken(loginDTO.getUsername(), "admin");
            
            Cookie authCookie = new Cookie("_auth", token);
            authCookie.setHttpOnly(true);
            authCookie.setPath("/");
            authCookie.setMaxAge(86400);
            response.addCookie(authCookie);
            
            return ResponseEntity.ok(new AuthResponse("Login successful", "admin"));
        }
        
        loginAttemptService.recordFailedAttempt(clientIp, loginDTO.getUsername());
        return ResponseEntity.status(401).body(new AuthResponse("Unauthorized", null));
    }
}
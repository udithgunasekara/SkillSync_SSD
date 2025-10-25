package BackEnd.controller;

import BackEnd.entity.UserCredential;
import BackEnd.service.OAuth2UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class OAuth2Controller {

    @Autowired
    private OAuth2UserService oAuth2UserService;

    @GetMapping("/login/google")
    public void googleLogin(HttpServletResponse response) throws IOException {
        // Redirect to Spring Boot's default OAuth2 authorization endpoint
        response.sendRedirect("/oauth2/authorization/google");
    }

    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        try {
            // Get or create user from OAuth2 data
            UserCredential user = oAuth2UserService.processOAuth2User(principal);
            
            Map<String, Object> response = new HashMap<>();
            response.put("authenticated", true);
            response.put("user", Map.of(
                "id", user.getUserId(),
                "userName", user.getUserName(),
                "role", user.getRole(),
                "email", principal.getAttribute("email"),
                "name", principal.getAttribute("name"),
                "picture", principal.getAttribute("picture")
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "authenticated", false,
                "error", "Failed to process user: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAuthStatus(@AuthenticationPrincipal OAuth2User principal) {
        Map<String, Object> status = new HashMap<>();
        
        if (principal != null) {
            status.put("authenticated", true);
            status.put("email", principal.getAttribute("email"));
            status.put("name", principal.getAttribute("name"));
        } else {
            status.put("authenticated", false);
        }
        
        return ResponseEntity.ok(status);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Invalidate session
            request.getSession().invalidate();
            
            Map<String, String> result = new HashMap<>();
            result.put("message", "Logged out successfully");
            result.put("status", "success");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> result = new HashMap<>();
            result.put("message", "Logout failed: " + e.getMessage());
            result.put("status", "error");
            
            return ResponseEntity.badRequest().body(result);
        }
    }

    @GetMapping("/login-url")
    public ResponseEntity<Map<String, String>> getLoginUrl() {
        Map<String, String> response = new HashMap<>();
        response.put("loginUrl", "/api/auth/login/google");
        response.put("provider", "google");
        return ResponseEntity.ok(response);
    }
}
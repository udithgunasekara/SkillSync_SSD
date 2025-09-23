package BackEnd.controller;

import BackEnd.entity.UserCredential;
import BackEnd.repository.UserCredentialRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * OAuth2 Controller to handle OAuth2 related endpoints
 * Provides user information and authentication status
 */
@RestController
@RequestMapping("/api/oauth2")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class OAuth2Controller {

    @Autowired
    private UserCredentialRepo userCredentialRepo;

    /**
     * Get current authenticated user information
     */
    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("authenticated", true);
        userInfo.put("name", principal.getAttribute("name"));
        userInfo.put("email", principal.getAttribute("email"));
        userInfo.put("picture", principal.getAttribute("picture"));
        userInfo.put("provider", "google");

        // Get additional user info from database if available
        String email = principal.getAttribute("email");
        if (email != null) {
            Optional<UserCredential> userCredential = userCredentialRepo.findByEmail(email);
            if (userCredential.isPresent()) {
                UserCredential user = userCredential.get();
                userInfo.put("userId", user.getUserId());
                userInfo.put("username", user.getUsername());
                userInfo.put("role", user.getRole());
                userInfo.put("fullName", user.getFullName());
            }
        }

        return ResponseEntity.ok(userInfo);
    }

    /**
     * Check authentication status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAuthStatus(@AuthenticationPrincipal OAuth2User principal) {
        Map<String, Object> status = new HashMap<>();
        status.put("authenticated", principal != null);
        
        if (principal != null) {
            status.put("provider", "google");
            status.put("email", principal.getAttribute("email"));
        }
        
        return ResponseEntity.ok(status);
    }

    /**
     * Login endpoint - redirects to Google OAuth2
     */
    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> login() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Redirect to Google OAuth2");
        response.put("loginUrl", "/oauth2/authorization/google");
        return ResponseEntity.ok(response);
    }

    /**
     * Success callback after OAuth2 login
     */
    @GetMapping("/success")
    public ResponseEntity<Map<String, Object>> loginSuccess(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Authentication failed"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("user", Map.of(
            "name", principal.getAttribute("name"),
            "email", principal.getAttribute("email"),
            "picture", principal.getAttribute("picture")
        ));

        return ResponseEntity.ok(response);
    }
}
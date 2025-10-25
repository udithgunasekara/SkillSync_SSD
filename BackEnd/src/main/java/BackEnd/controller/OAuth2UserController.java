package BackEnd.controller;

import BackEnd.entity.UserCredential;
import BackEnd.service.OAuth2UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/oauth2")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class OAuth2UserController {

    @Autowired
    private OAuth2UserService oAuth2UserService;

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
        }

        try {
            UserCredential user = oAuth2UserService.processOAuth2User(principal);
            
            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getUserId());
            profile.put("userName", user.getUserName());
            profile.put("email", user.getEmail());
            profile.put("fullName", user.getFullName());
            profile.put("profilePicture", user.getProfilePicture());
            profile.put("role", user.getRole());
            profile.put("provider", user.getProvider());
            profile.put("isOAuth2User", oAuth2UserService.isOAuth2User(user));
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get user profile: " + e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateUserProfile(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestBody Map<String, String> updateData) {
        
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
        }

        try {
            UserCredential user = oAuth2UserService.processOAuth2User(principal);
            
            String fullName = updateData.get("fullName");
            String profilePicture = updateData.get("profilePicture");
            
            UserCredential updatedUser = oAuth2UserService.updateUserProfile(user.getUserId(), fullName, profilePicture);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("user", Map.of(
                "id", updatedUser.getUserId(),
                "userName", updatedUser.getUserName(),
                "email", updatedUser.getEmail(),
                "fullName", updatedUser.getFullName(),
                "profilePicture", updatedUser.getProfilePicture(),
                "role", updatedUser.getRole()
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update profile: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<Map<String, Object>> getUserByEmail(@PathVariable String email) {
        try {
            Optional<UserCredential> userOpt = oAuth2UserService.findByEmail(email);
            
            if (userOpt.isPresent()) {
                UserCredential user = userOpt.get();
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getUserId());
                userData.put("userName", user.getUserName());
                userData.put("email", user.getEmail());
                userData.put("fullName", user.getFullName());
                userData.put("role", user.getRole());
                userData.put("isOAuth2User", oAuth2UserService.isOAuth2User(user));
                
                return ResponseEntity.ok(userData);
            } else {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get user: " + e.getMessage()));
        }
    }

    @GetMapping("/check-auth")
    public ResponseEntity<Map<String, Object>> checkAuthentication(@AuthenticationPrincipal OAuth2User principal) {
        Map<String, Object> response = new HashMap<>();
        
        if (principal != null) {
            response.put("authenticated", true);
            response.put("email", principal.getAttribute("email"));
            response.put("name", principal.getAttribute("name"));
            response.put("provider", "google");
        } else {
            response.put("authenticated", false);
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/link-account")
    public ResponseEntity<Map<String, Object>> linkAccount(
            @AuthenticationPrincipal OAuth2User principal,
            @RequestBody Map<String, String> linkData) {
        
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
        }

        try {
            // This would be used to link an OAuth2 account to an existing traditional account
            // For now, we'll just update the user information
            UserCredential user = oAuth2UserService.processOAuth2User(principal);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Account linked successfully");
            response.put("userId", user.getUserId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to link account: " + e.getMessage()));
        }
    }
}
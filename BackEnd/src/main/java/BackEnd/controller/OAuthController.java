package BackEnd.controller;

import BackEnd.DTO.AuthenticationResponse;
import BackEnd.DTO.GoogleTokenRequest;
import BackEnd.DTO.OAuthUserDTO;
import BackEnd.entity.OAuthUser;
import BackEnd.service.JwtService;
import BackEnd.service.OAuthUserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OAuthController {
    
    private final OAuthUserService oAuthUserService;
    private final JwtService jwtService;
    
    /**
     * Authenticate with Google OAuth
     */
    @PostMapping("/google")
    public ResponseEntity<AuthenticationResponse> googleAuth(@RequestBody GoogleTokenRequest request) {
        try {
            AuthenticationResponse response = oAuthUserService.authenticateWithGoogle(request);
            
            if (response.getToken() != null) {
                return ResponseEntity.ok(response);
            } else if (response.isNeedsRoleSelection()) {
                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthenticationResponse.error("Authentication failed: " + e.getMessage()));
        }
    }
    
    /**
     * Complete registration with role selection
     */
    @PostMapping("/complete-registration")
    public ResponseEntity<AuthenticationResponse> completeRegistration(@RequestBody GoogleTokenRequest request) {
        try {
            if (request.getRole() == null) {
                return ResponseEntity.badRequest()
                        .body(AuthenticationResponse.error("Role is required"));
            }
            
            AuthenticationResponse response = oAuthUserService.authenticateWithGoogle(request);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthenticationResponse.error("Registration completion failed: " + e.getMessage()));
        }
    }
    
    /**
     * Refresh JWT token
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null || refreshToken.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(AuthenticationResponse.error("Refresh token is required"));
            }
            
            AuthenticationResponse response = oAuthUserService.refreshToken(refreshToken);
            
            if (response.getToken() != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(AuthenticationResponse.error("Token refresh failed: " + e.getMessage()));
        }
    }
    
    /**
     * Get current user information from JWT token
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authorization header missing or invalid"));
            }
            
            String token = authHeader.substring(7);
            if (!oAuthUserService.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid or expired token"));
            }
            
            String googleId = jwtService.getGoogleIdFromToken(token);
            Optional<OAuthUserDTO> userOpt = oAuthUserService.getUserByGoogleId(googleId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }
            
            OAuthUserDTO user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("googleId", user.getGoogleId());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("fullName", user.getFullName());
            response.put("profilePicture", user.getProfilePicture());
            response.put("role", user.getRole().toString());
            response.put("linkedUsername", user.getLinkedUsername());
            response.put("isActive", user.getIsActive());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get user information: " + e.getMessage()));
        }
    }
    
    /**
     * Update user role
     */
    @PutMapping("/role")
    public ResponseEntity<Map<String, Object>> updateRole(
            HttpServletRequest request, 
            @RequestBody Map<String, String> roleRequest) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authorization header missing or invalid"));
            }
            
            String token = authHeader.substring(7);
            if (!oAuthUserService.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid or expired token"));
            }
            
            String googleId = jwtService.getGoogleIdFromToken(token);
            String roleStr = roleRequest.get("role");
            
            if (roleStr == null || roleStr.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Role is required"));
            }
            
            OAuthUser.UserRole role;
            try {
                role = OAuthUser.UserRole.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid role. Must be FREELANCER, CLIENT, or ADMIN"));
            }
            
            OAuthUserDTO updatedUser = oAuthUserService.updateUserRole(googleId, role);
            
            return ResponseEntity.ok(Map.of(
                "message", "Role updated successfully",
                "user", updatedUser
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update role: " + e.getMessage()));
        }
    }
    
    /**
     * Link existing traditional account
     */
    @PostMapping("/link-account")
    public ResponseEntity<Map<String, Object>> linkAccount(
            HttpServletRequest request, 
            @RequestBody Map<String, String> linkRequest) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authorization header missing or invalid"));
            }
            
            String token = authHeader.substring(7);
            if (!oAuthUserService.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid or expired token"));
            }
            
            String googleId = jwtService.getGoogleIdFromToken(token);
            String username = linkRequest.get("username");
            
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Username is required"));
            }
            
            OAuthUserDTO updatedUser = oAuthUserService.linkExistingAccount(googleId, username.trim());
            
            return ResponseEntity.ok(Map.of(
                "message", "Account linked successfully",
                "user", updatedUser
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to link account: " + e.getMessage()));
        }
    }
    
    /**
     * Logout (client-side token removal)
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        // OAuth logout is primarily client-side (remove tokens from storage)
        // This endpoint can be used for additional cleanup if needed
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
}
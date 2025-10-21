package BackEnd.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;  // JWT token for frontend
    private String refreshToken;  // Refresh token
    private OAuthUserDTO user;  // User information
    private boolean isNewUser;  // Whether this is a new registration
    private boolean needsRoleSelection;  // Whether user needs to select role
    private String message;  // Success/error message
    
    // Success response
    public static AuthenticationResponse success(String token, String refreshToken, OAuthUserDTO user, boolean isNewUser) {
        return new AuthenticationResponse(token, refreshToken, user, isNewUser, false, "Authentication successful");
    }
    
    // Role selection needed response
    public static AuthenticationResponse needsRoleSelection(OAuthUserDTO user) {
        return new AuthenticationResponse(null, null, user, true, true, "Please select your role");
    }
    
    // Error response
    public static AuthenticationResponse error(String message) {
        return new AuthenticationResponse(null, null, null, false, false, message);
    }
}
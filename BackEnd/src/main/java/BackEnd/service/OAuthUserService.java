package BackEnd.service;

import BackEnd.DTO.AuthenticationResponse;
import BackEnd.DTO.GoogleTokenRequest;
import BackEnd.DTO.OAuthUserDTO;
import BackEnd.entity.OAuthUser;

import java.util.Optional;

public interface OAuthUserService {
    
    /**
     * Authenticate user with Google OAuth token
     */
    AuthenticationResponse authenticateWithGoogle(GoogleTokenRequest request);
    
    /**
     * Get user by Google ID
     */
    Optional<OAuthUserDTO> getUserByGoogleId(String googleId);
    
    /**
     * Get user by email
     */
    Optional<OAuthUserDTO> getUserByEmail(String email);
    
    /**
     * Update user role
     */
    OAuthUserDTO updateUserRole(String googleId, OAuthUser.UserRole role);
    
    /**
     * Link existing traditional account to OAuth user
     */
    OAuthUserDTO linkExistingAccount(String googleId, String username);
    
    /**
     * Validate JWT token
     */
    boolean validateToken(String token);
    
    /**
     * Refresh JWT token
     */
    AuthenticationResponse refreshToken(String refreshToken);
}
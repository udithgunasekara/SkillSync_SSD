package BackEnd.service.imple;

import BackEnd.DTO.AuthenticationResponse;
import BackEnd.DTO.GoogleTokenRequest;
import BackEnd.DTO.OAuthUserDTO;
import BackEnd.Mapper.OAuthUserMapper;
import BackEnd.entity.OAuthUser;
import BackEnd.repository.OAuthUserRepository;
import BackEnd.service.GoogleOAuthService;
import BackEnd.service.JwtService;
import BackEnd.service.OAuthUserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
public class OAuthUserServiceImpl implements OAuthUserService {
    
    private final OAuthUserRepository oAuthUserRepository;
    private final GoogleOAuthService googleOAuthService;
    private final JwtService jwtService;
    
    @Override
    @Transactional
    public AuthenticationResponse authenticateWithGoogle(GoogleTokenRequest request) {
        try {
            // Verify Google token and get user info
            GoogleOAuthService.GoogleUserInfo googleUserInfo = googleOAuthService.verifyGoogleToken(request.getIdToken());
            
            if (!googleUserInfo.getEmailVerified()) {
                return AuthenticationResponse.error("Email not verified with Google");
            }
            
            // Check if user already exists
            Optional<OAuthUser> existingUser = oAuthUserRepository.findByGoogleId(googleUserInfo.getGoogleId());
            
            if (existingUser.isPresent()) {
                // Existing user login
                OAuthUser user = existingUser.get();
                user.updateLastLogin();
                oAuthUserRepository.save(user);
                
                return createSuccessResponse(user, false);
            } else {
                // New user registration
                if (request.getRole() == null) {
                    // User needs to select role - return user info for role selection
                    OAuthUserDTO tempUser = new OAuthUserDTO();
                    tempUser.setGoogleId(googleUserInfo.getGoogleId());
                    tempUser.setEmail(googleUserInfo.getEmail());
                    tempUser.setFirstName(googleUserInfo.getFirstName());
                    tempUser.setLastName(googleUserInfo.getLastName());
                    tempUser.setProfilePicture(googleUserInfo.getProfilePicture());
                    
                    return AuthenticationResponse.needsRoleSelection(tempUser);
                }
                
                // Create new user with selected role
                OAuthUser newUser = OAuthUserMapper.createFromGoogleData(
                    googleUserInfo.getGoogleId(),
                    googleUserInfo.getEmail(),
                    googleUserInfo.getFirstName(),
                    googleUserInfo.getLastName(),
                    googleUserInfo.getProfilePicture(),
                    request.getRole()
                );
                
                // Set linked username if provided
                if (request.getLinkedUsername() != null && !request.getLinkedUsername().trim().isEmpty()) {
                    newUser.setLinkedUsername(request.getLinkedUsername().trim());
                }
                
                newUser = oAuthUserRepository.save(newUser);
                return createSuccessResponse(newUser, true);
            }
            
        } catch (Exception e) {
            return AuthenticationResponse.error("Authentication failed: " + e.getMessage());
        }
    }
    
    @Override
    public Optional<OAuthUserDTO> getUserByGoogleId(String googleId) {
        return oAuthUserRepository.findByGoogleId(googleId)
                .map(OAuthUserMapper::mapToOAuthUserDTO);
    }
    
    @Override
    public Optional<OAuthUserDTO> getUserByEmail(String email) {
        return oAuthUserRepository.findByEmail(email)
                .map(OAuthUserMapper::mapToOAuthUserDTO);
    }
    
    @Override
    @Transactional
    public OAuthUserDTO updateUserRole(String googleId, OAuthUser.UserRole role) {
        OAuthUser user = oAuthUserRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setRole(role);
        user = oAuthUserRepository.save(user);
        
        return OAuthUserMapper.mapToOAuthUserDTO(user);
    }
    
    @Override
    @Transactional
    public OAuthUserDTO linkExistingAccount(String googleId, String username) {
        OAuthUser user = oAuthUserRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify that the username is not already linked to another OAuth user
        Optional<OAuthUser> existingLinked = oAuthUserRepository.findByLinkedUsername(username);
        if (existingLinked.isPresent() && !existingLinked.get().getGoogleId().equals(googleId)) {
            throw new RuntimeException("Username already linked to another account");
        }
        
        user.setLinkedUsername(username);
        user = oAuthUserRepository.save(user);
        
        return OAuthUserMapper.mapToOAuthUserDTO(user);
    }
    
    @Override
    public boolean validateToken(String token) {
        return jwtService.validateToken(token) && !jwtService.isTokenExpired(token);
    }
    
    @Override
    public AuthenticationResponse refreshToken(String refreshToken) {
        try {
            if (!jwtService.validateToken(refreshToken) || jwtService.isTokenExpired(refreshToken)) {
                return AuthenticationResponse.error("Invalid or expired refresh token");
            }
            
            String tokenType = jwtService.getTokenType(refreshToken);
            if (!"REFRESH".equals(tokenType)) {
                return AuthenticationResponse.error("Invalid token type");
            }
            
            String googleId = jwtService.getGoogleIdFromToken(refreshToken);
            Optional<OAuthUser> userOpt = oAuthUserRepository.findActiveUserByGoogleId(googleId);
            
            if (userOpt.isEmpty()) {
                return AuthenticationResponse.error("User not found or inactive");
            }
            
            return createSuccessResponse(userOpt.get(), false);
            
        } catch (Exception e) {
            return AuthenticationResponse.error("Token refresh failed: " + e.getMessage());
        }
    }
    
    private AuthenticationResponse createSuccessResponse(OAuthUser user, boolean isNewUser) {
        // Generate tokens
        String accessToken = jwtService.generateToken(
            user.getGoogleId(),
            user.getEmail(), 
            user.getRole().toString(),
            user.getLinkedUsername() != null ? user.getLinkedUsername() : user.getEmail()
        );
        
        String refreshToken = jwtService.generateRefreshToken(user.getGoogleId());
        
        // Convert to DTO
        OAuthUserDTO userDTO = OAuthUserMapper.mapToOAuthUserDTO(user);
        
        return AuthenticationResponse.success(accessToken, refreshToken, userDTO, isNewUser);
    }
}
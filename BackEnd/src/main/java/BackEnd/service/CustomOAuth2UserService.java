package BackEnd.service;

import BackEnd.entity.UserCredential;
import BackEnd.repository.UserCredentialRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Custom OAuth2 User Service to handle Google OAuth2 user information
 * This service integrates OAuth2 users with our application's user system
 */
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserCredentialRepo userCredentialRepo;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Load user from Google
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        // Extract user information from Google
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String googleId = oauth2User.getAttribute("sub"); // Google's unique identifier
        String picture = oauth2User.getAttribute("picture");
        
        // Process the user (create or update in database)
        processOAuth2User(email, name, googleId, picture);
        
        return oauth2User;
    }

    /**
     * Process OAuth2 user - create new user or update existing user
     */
    private void processOAuth2User(String email, String name, String googleId, String picture) {
        Optional<UserCredential> existingUser = userCredentialRepo.findByEmail(email);
        
        if (existingUser.isPresent()) {
            // Update existing user with Google information
            UserCredential user = existingUser.get();
            user.setGoogleId(googleId);
            user.setProfilePictureUrl(picture);
            user.setLastLoginDate(LocalDateTime.now());
            user.setOauth2Provider("google");
            userCredentialRepo.save(user);
        } else {
            // Create new user from Google OAuth2 data
            UserCredential newUser = new UserCredential();
            newUser.setEmail(email);
            newUser.setFirstName(extractFirstName(name));
            newUser.setLastName(extractLastName(name));
            newUser.setGoogleId(googleId);
            newUser.setProfilePictureUrl(picture);
            newUser.setOauth2Provider("google");
            newUser.setEmailVerified(true); // Google emails are pre-verified
            newUser.setAccountNonLocked(true);
            newUser.setEnabled(true);
            newUser.setCreatedDate(LocalDateTime.now());
            newUser.setLastLoginDate(LocalDateTime.now());
            
            // Generate a username from email
            newUser.setUsername(generateUsernameFromEmail(email));
            
            userCredentialRepo.save(newUser);
        }
    }

    /**
     * Extract first name from full name
     */
    private String extractFirstName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "User";
        }
        String[] parts = fullName.trim().split("\\s+");
        return parts[0];
    }

    /**
     * Extract last name from full name
     */
    private String extractLastName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "";
        }
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length > 1) {
            return String.join(" ", java.util.Arrays.copyOfRange(parts, 1, parts.length));
        }
        return "";
    }

    /**
     * Generate username from email
     */
    private String generateUsernameFromEmail(String email) {
        String baseUsername = email.substring(0, email.indexOf("@"));
        
        // Check if username already exists
        Optional<UserCredential> existingUser = userCredentialRepo.findByUsername(baseUsername);
        if (existingUser.isEmpty()) {
            return baseUsername;
        }
        
        // If username exists, append numbers until we find an available one
        int counter = 1;
        String newUsername;
        do {
            newUsername = baseUsername + counter;
            counter++;
        } while (userCredentialRepo.findByUsername(newUsername).isPresent());
        
        return newUsername;
    }
}
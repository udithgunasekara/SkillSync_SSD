package BackEnd.service;

import BackEnd.entity.UserCredential;
import BackEnd.repository.UserCredentialRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OAuth2UserService {

    @Autowired
    private UserCredentialRepo userCredentialRepo;

    public UserCredential processOAuth2User(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        String providerId = oAuth2User.getAttribute("sub"); // Google's user ID
        String provider = "google";

        // Check if user already exists by provider and providerId
        Optional<UserCredential> existingUser = userCredentialRepo.findByProviderAndProviderId(provider, providerId);
        
        if (existingUser.isPresent()) {
            // Update existing user's information
            UserCredential user = existingUser.get();
            user.setEmail(email);
            user.setFullName(name);
            user.setProfilePicture(picture);
            return userCredentialRepo.save(user);
        }

        // Check if user exists by email (for linking existing accounts)
        Optional<UserCredential> userByEmail = userCredentialRepo.findByEmail(email);
        
        if (userByEmail.isPresent()) {
            // Link OAuth2 account to existing user
            UserCredential user = userByEmail.get();
            user.setProvider(provider);
            user.setProviderId(providerId);
            user.setFullName(name);
            user.setProfilePicture(picture);
            return userCredentialRepo.save(user);
        }

        // Create new user
        UserCredential newUser = new UserCredential();
        newUser.setEmail(email);
        newUser.setUserName(email); // Use email as username for OAuth2 users
        newUser.setFullName(name);
        newUser.setProfilePicture(picture);
        newUser.setProvider(provider);
        newUser.setProviderId(providerId);
        newUser.setRole("USER"); // Default role for OAuth2 users
        newUser.setPassword(null); // OAuth2 users don't have passwords

        return userCredentialRepo.save(newUser);
    }

    public Optional<UserCredential> findByEmail(String email) {
        return userCredentialRepo.findByEmail(email);
    }

    public Optional<UserCredential> findByProviderAndProviderId(String provider, String providerId) {
        return userCredentialRepo.findByProviderAndProviderId(provider, providerId);
    }

    public UserCredential updateUserProfile(Long userId, String fullName, String profilePicture) {
        Optional<UserCredential> userOpt = userCredentialRepo.findById(userId);
        if (userOpt.isPresent()) {
            UserCredential user = userOpt.get();
            if (fullName != null) {
                user.setFullName(fullName);
            }
            if (profilePicture != null) {
                user.setProfilePicture(profilePicture);
            }
            return userCredentialRepo.save(user);
        }
        throw new RuntimeException("User not found with ID: " + userId);
    }

    public boolean isOAuth2User(UserCredential user) {
        return user.getProvider() != null && user.getProviderId() != null;
    }
}
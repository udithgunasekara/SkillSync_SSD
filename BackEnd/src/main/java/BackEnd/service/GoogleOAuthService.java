package BackEnd.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class GoogleOAuthService {
    
    @Value("${google.client-id}")
    private String googleClientId;
    
    private static final String GOOGLE_TOKEN_VERIFY_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public GoogleOAuthService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Verify Google ID token and extract user information
     */
    public GoogleUserInfo verifyGoogleToken(String idToken) {
        try {
            String url = GOOGLE_TOKEN_VERIFY_URL + idToken;
            String response = restTemplate.getForObject(url, String.class);
            
            if (response == null) {
                throw new RuntimeException("Failed to verify Google token");
            }
            
            @SuppressWarnings("unchecked")
            Map<String, Object> tokenInfo = objectMapper.readValue(response, Map.class);
            
            // Verify the audience (client ID)
            String aud = (String) tokenInfo.get("aud");
            if (!googleClientId.equals(aud)) {
                throw new RuntimeException("Invalid audience in Google token");
            }
            
            // Extract user information
            return GoogleUserInfo.builder()
                    .googleId((String) tokenInfo.get("sub"))
                    .email((String) tokenInfo.get("email"))
                    .firstName((String) tokenInfo.get("given_name"))
                    .lastName((String) tokenInfo.get("family_name"))
                    .profilePicture((String) tokenInfo.get("picture"))
                    .emailVerified((Boolean) tokenInfo.get("email_verified"))
                    .build();
                    
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify Google token: " + e.getMessage());
        }
    }
    
    /**
     * Google User Information from ID token
     */
    public static class GoogleUserInfo {
        private String googleId;
        private String email;
        private String firstName;
        private String lastName;
        private String profilePicture;
        private Boolean emailVerified;
        
        public GoogleUserInfo() {}
        
        public GoogleUserInfo(String googleId, String email, String firstName, 
                            String lastName, String profilePicture, Boolean emailVerified) {
            this.googleId = googleId;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.profilePicture = profilePicture;
            this.emailVerified = emailVerified;
        }
        
        public static GoogleUserInfoBuilder builder() {
            return new GoogleUserInfoBuilder();
        }
        
        // Getters and setters
        public String getGoogleId() { return googleId; }
        public void setGoogleId(String googleId) { this.googleId = googleId; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        
        public String getProfilePicture() { return profilePicture; }
        public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
        
        public Boolean getEmailVerified() { return emailVerified; }
        public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
        
        public String getFullName() {
            return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
        }
    }
    
    /**
     * Builder for GoogleUserInfo
     */
    public static class GoogleUserInfoBuilder {
        private String googleId;
        private String email;
        private String firstName;
        private String lastName;
        private String profilePicture;
        private Boolean emailVerified;
        
        public GoogleUserInfoBuilder googleId(String googleId) {
            this.googleId = googleId;
            return this;
        }
        
        public GoogleUserInfoBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public GoogleUserInfoBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        
        public GoogleUserInfoBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        
        public GoogleUserInfoBuilder profilePicture(String profilePicture) {
            this.profilePicture = profilePicture;
            return this;
        }
        
        public GoogleUserInfoBuilder emailVerified(Boolean emailVerified) {
            this.emailVerified = emailVerified;
            return this;
        }
        
        public GoogleUserInfo build() {
            return new GoogleUserInfo(googleId, email, firstName, lastName, profilePicture, emailVerified);
        }
    }
}
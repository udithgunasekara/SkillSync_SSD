package BackEnd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/oauth2")
public class OAuth2TestController {

    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;

    @GetMapping("/test")
    public Map<String, Object> testOAuth2Config() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            ClientRegistration googleClient = clientRegistrationRepository.findByRegistrationId("google");
            
            if (googleClient != null) {
                response.put("status", "OAuth2 configuration found");
                response.put("clientName", googleClient.getClientName());
                response.put("authorizationUri", googleClient.getProviderDetails().getAuthorizationUri());
                response.put("redirectUri", googleClient.getRedirectUri());
                response.put("scopes", googleClient.getScopes());
            } else {
                response.put("status", "OAuth2 configuration NOT found");
                response.put("error", "Google client registration not found");
            }
        } catch (Exception e) {
            response.put("status", "Error");
            response.put("error", e.getMessage());
        }
        
        return response;
    }

    @GetMapping("/google-login-url")
    public Map<String, String> getGoogleLoginUrl() {
        Map<String, String> response = new HashMap<>();
        response.put("loginUrl", "/oauth2/authorization/google");
        response.put("fullUrl", "http://localhost:8082/oauth2/authorization/google");
        response.put("instruction", "Visit this URL to start Google OAuth login");
        return response;
    }
}
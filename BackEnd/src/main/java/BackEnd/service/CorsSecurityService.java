package BackEnd.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * CORS Security Service
 * Provides additional security validation for CORS requests
 * Helps prevent Cross-Domain Misconfiguration vulnerabilities
 */
@Service
public class CorsSecurityService {
    
    private static final Logger logger = LoggerFactory.getLogger(CorsSecurityService.class);
    
    @Value("${app.cors.allowed-origins:http://localhost:3000,http://127.0.0.1:3000}")
    private String[] allowedOrigins;
    
    /**
     * Validates if the origin is in the allowed list
     * @param origin The origin to validate
     * @return true if origin is allowed, false otherwise
     */
    public boolean isOriginAllowed(String origin) {
        if (origin == null || origin.trim().isEmpty()) {
            logger.warn("CORS Security: Empty or null origin detected");
            return false;
        }
        
        List<String> allowedList = Arrays.asList(allowedOrigins);
        boolean isAllowed = allowedList.contains(origin);
        
        if (!isAllowed) {
            logger.warn("CORS Security: Blocked request from unauthorized origin: {}", origin);
        } else {
            logger.debug("CORS Security: Allowed request from authorized origin: {}", origin);
        }
        
        return isAllowed;
    }
    
    /**
     * Gets the list of allowed origins
     * @return Array of allowed origins
     */
    public String[] getAllowedOrigins() {
        return allowedOrigins.clone();
    }
    
    /**
     * Validates if the request headers are safe
     * @param headers The headers to validate
     * @return true if headers are safe, false otherwise
     */
    public boolean areHeadersSafe(String[] headers) {
        if (headers == null) {
            return true;
        }
        
        // Check for potentially dangerous headers
        for (String header : headers) {
            if (header != null && header.toLowerCase().contains("script")) {
                logger.warn("CORS Security: Potentially dangerous header detected: {}", header);
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Logs CORS request for security monitoring
     * @param origin The request origin
     * @param method The HTTP method
     * @param path The request path
     */
    public void logCorsRequest(String origin, String method, String path) {
        logger.info("CORS Request - Origin: {}, Method: {}, Path: {}", origin, method, path);
    }
}
package BackEnd.service;

import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;
import java.util.regex.Pattern;

@Service
public class InputValidationService {
    
    // Username validation: alphanumeric and underscore only, 3-30 characters
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9_]{3,30}$");
    
    // Email validation
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    
    // ID validation: positive numbers only
    private static final Pattern ID_PATTERN = Pattern.compile("^[1-9]\\d*$");
    
    public void validateUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty");
        }
        if (!USERNAME_PATTERN.matcher(username.trim()).matches()) {
            throw new IllegalArgumentException("Invalid username format. Only alphanumeric characters and underscore allowed, 3-30 characters.");
        }
    }
    
    public void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID must be a positive number");
        }
    }
    
    public void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (!EMAIL_PATTERN.matcher(email.trim()).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }
    
    public String sanitizeString(String input) {
        if (input == null) {
            return null;
        }
        
        // First trim the input
        String trimmed = input.trim();
        
        // HTML encode to prevent XSS
        String htmlEncoded = HtmlUtils.htmlEscape(trimmed);
        
        // Remove potentially dangerous patterns
        String sanitized = htmlEncoded
                   .replaceAll("(?i)javascript:", "")
                   .replaceAll("(?i)vbscript:", "")
                   .replaceAll("(?i)data:", "")
                   .replaceAll("(?i)about:", "")
                   .replaceAll("--", "")
                   .replaceAll("/\\*", "")
                   .replaceAll("\\*/", "");
                   
        return sanitized;
    }
    
    public String sanitizeHtml(String input) {
        if (input == null) {
            return null;
        }
        
        // For HTML content, use HTML encoding to escape all HTML entities
        return HtmlUtils.htmlEscape(input.trim());
    }
    
    public boolean isValidUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        
        String lowercaseUrl = url.toLowerCase().trim();
        
        // Block dangerous URL schemes
        if (lowercaseUrl.startsWith("javascript:") || 
            lowercaseUrl.startsWith("data:") ||
            lowercaseUrl.startsWith("vbscript:") ||
            lowercaseUrl.startsWith("about:")) {
            return false;
        }
        
        // Allow only http, https, and relative URLs
        return lowercaseUrl.startsWith("http://") || 
               lowercaseUrl.startsWith("https://") ||
               lowercaseUrl.startsWith("/") ||
               lowercaseUrl.startsWith("./") ||
               lowercaseUrl.startsWith("../") ||
               !lowercaseUrl.contains(":");
    }
}
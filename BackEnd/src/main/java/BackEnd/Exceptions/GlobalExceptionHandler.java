package BackEnd.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.validation.FieldError;
import org.springframework.web.util.HtmlUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    // Pattern to detect potential XSS attempts
    private static final Pattern XSS_PATTERN = Pattern.compile(
        "(?i)<script[^>]*>.*?</script>|javascript:|on\\w+\\s*=|<iframe|<object|<embed|<link|<meta",
        Pattern.CASE_INSENSITIVE | Pattern.DOTALL
    );

    /**
     * Sanitizes input to prevent XSS attacks
     * @param input The input string to sanitize
     * @return Sanitized string safe for output
     */
    private String sanitizeForXSS(String input) {
        if (input == null) {
            return null;
        }
        
        // HTML encode to prevent XSS
        String sanitized = HtmlUtils.htmlEscape(input);
        
        // Additional checks for potential XSS patterns
        if (XSS_PATTERN.matcher(input).find()) {
            logger.warn("Potential XSS attempt detected and sanitized: {}", input);
            // Further sanitization - remove suspicious content
            sanitized = input.replaceAll("(?i)<script[^>]*>.*?</script>", "")
                            .replaceAll("(?i)javascript:", "")
                            .replaceAll("(?i)on\\w+\\s*=", "")
                            .replaceAll("(?i)<iframe[^>]*>", "")
                            .replaceAll("(?i)<object[^>]*>", "")
                            .replaceAll("(?i)<embed[^>]*>", "");
            sanitized = HtmlUtils.htmlEscape(sanitized);
        }
        
        return sanitized;
    }

    /**
     * Sanitizes error response to prevent XSS in error messages
     */
    private Map<String, String> createSafeErrorResponse(String error, String message) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", sanitizeForXSS(error));
        errors.put("message", sanitizeForXSS(message));
        errors.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return errors;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(IllegalArgumentException ex) {
        // Log the actual error for debugging but don't expose to user
        logger.warn("Input validation failed: {}", ex.getMessage());
        
        Map<String, String> errors = createSafeErrorResponse(
            "Input validation failed", 
            "Invalid input provided. Please check your data and try again."
        );
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            // Sanitize both field name and error message to prevent XSS
            errors.put(sanitizeForXSS(fieldName), sanitizeForXSS(errorMessage));
        });
        errors.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle constraint validation errors with XSS protection
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolationException(
            ConstraintViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            String fieldName = violation.getPropertyPath().toString();
            String errorMessage = violation.getMessage();
            // Sanitize to prevent XSS in validation error messages
            errors.put(sanitizeForXSS(fieldName), sanitizeForXSS(errorMessage));
        }
        errors.put("timestamp", String.valueOf(System.currentTimeMillis()));
        
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle security-related exceptions with XSS protection
     */
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, String>> handleSecurityException(SecurityException ex) {
        logger.warn("Security exception occurred: {}", ex.getMessage());
        
        Map<String, String> errors = createSafeErrorResponse(
            "Security violation", 
            "Access denied due to security policy"
        );
        return new ResponseEntity<>(errors, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ResourceNotFound.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFoundException(ResourceNotFound ex) {
        Map<String, String> errors = createSafeErrorResponse(
            "Resource not found", 
            "The requested resource could not be found"
        );
        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        // Log the full stack trace for debugging but don't expose to user
        logger.error("Unexpected error occurred", ex);
        
        Map<String, String> errors = createSafeErrorResponse(
            "Internal server error", 
            "An unexpected error occurred. Please try again later."
        );
        return new ResponseEntity<>(errors, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
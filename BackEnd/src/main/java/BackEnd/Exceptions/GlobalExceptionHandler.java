package BackEnd.Exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.validation.FieldError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(IllegalArgumentException ex) {
        // Log the actual error for debugging but don't expose to user
        logger.warn("Input validation failed: {}", ex.getMessage());
        
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Input validation failed");
        errors.put("message", "Invalid input provided. Please check your data and try again.");
        errors.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        errors.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFound.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFoundException(ResourceNotFound ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Resource not found");
        errors.put("message", "The requested resource could not be found");
        errors.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        // Log the full stack trace for debugging but don't expose to user
        logger.error("Unexpected error occurred", ex);
        
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Internal server error");
        errors.put("message", "An unexpected error occurred. Please try again later.");
        errors.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return new ResponseEntity<>(errors, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
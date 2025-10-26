package BackEnd.Exceptions;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.Map;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Test class for GlobalExceptionHandler XSS protection
 */
public class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler globalExceptionHandler;

    @BeforeEach
    void setUp() {
        globalExceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    void testXSSProtectionInIllegalArgumentException() {
        // Create an exception with XSS payload
        String maliciousMessage = "<script>alert('XSS')</script>Malicious input";
        IllegalArgumentException ex = new IllegalArgumentException(maliciousMessage);

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleValidationException(ex);

        // Verify response
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, String> responseBody = response.getBody();
        assertNotNull(responseBody);
        
        // Verify XSS content is sanitized in error message
        String errorMessage = responseBody.get("error");
        String message = responseBody.get("message");
        
        assertFalse(errorMessage.contains("<script>"));
        assertFalse(errorMessage.contains("alert"));
        assertFalse(message.contains("<script>"));
        assertFalse(message.contains("alert"));
        
        // Verify HTML encoding
        assertTrue(errorMessage.contains("&lt;") || !errorMessage.contains("<"));
    }

    @Test
    void testXSSProtectionInMethodArgumentNotValidException() {
        // Mock MethodArgumentNotValidException with XSS payload
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        
        // Create field error with XSS payload
        FieldError fieldError = new FieldError("testObject", "testField<script>", 
                                               "Error message<script>alert('XSS')</script>");
        
        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getAllErrors()).thenReturn(Arrays.asList(fieldError));

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleValidationExceptions(ex);

        // Verify response
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, String> responseBody = response.getBody();
        assertNotNull(responseBody);
        
        // Verify XSS content is sanitized
        responseBody.forEach((key, value) -> {
            assertFalse(key.contains("<script>"), "Key should not contain script tags: " + key);
            assertFalse(value.contains("<script>"), "Value should not contain script tags: " + value);
            assertFalse(key.contains("alert("), "Key should not contain alert calls: " + key);
            assertFalse(value.contains("alert("), "Value should not contain alert calls: " + value);
        });
    }

    @Test
    void testSecurityExceptionHandling() {
        SecurityException ex = new SecurityException("Unauthorized access attempt");

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleSecurityException(ex);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        Map<String, String> responseBody = response.getBody();
        assertNotNull(responseBody);
        
        assertTrue(responseBody.containsKey("error"));
        assertTrue(responseBody.containsKey("message"));
        assertTrue(responseBody.containsKey("timestamp"));
        
        assertEquals("Security violation", responseBody.get("error"));
        assertEquals("Access denied due to security policy", responseBody.get("message"));
    }

    @Test
    void testResourceNotFoundHandling() {
        ResourceNotFound ex = new ResourceNotFound("User not found");

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleResourceNotFoundException(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        Map<String, String> responseBody = response.getBody();
        assertNotNull(responseBody);
        
        assertEquals("Resource not found", responseBody.get("error"));
        assertEquals("The requested resource could not be found", responseBody.get("message"));
        assertTrue(responseBody.containsKey("timestamp"));
    }

    @Test
    void testGenericExceptionHandling() {
        Exception ex = new RuntimeException("Unexpected error");

        ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleGenericException(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Map<String, String> responseBody = response.getBody();
        assertNotNull(responseBody);
        
        assertEquals("Internal server error", responseBody.get("error"));
        assertEquals("An unexpected error occurred. Please try again later.", responseBody.get("message"));
        assertTrue(responseBody.containsKey("timestamp"));
    }

    @Test
    void testXSSPatternsAreSanitized() {
        // Test various XSS patterns
        String[] xssPayloads = {
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<iframe src='javascript:alert(1)'></iframe>",
            "<object data='javascript:alert(1)'></object>",
            "<img onload='alert(1)' src='x'>",
            "<div onclick='alert(1)'>Click me</div>",
            "<meta http-equiv='refresh' content='0;url=javascript:alert(1)'>"
        };

        for (String payload : xssPayloads) {
            IllegalArgumentException ex = new IllegalArgumentException(payload);
            ResponseEntity<Map<String, String>> response = globalExceptionHandler.handleValidationException(ex);
            
            Map<String, String> responseBody = response.getBody();
            assertNotNull(responseBody, "Response body should not be null for payload: " + payload);
            
            // Check that dangerous content is not present in the response
            responseBody.values().forEach(value -> {
                assertFalse(value.contains("<script"), "Response should not contain script tags for payload: " + payload);
                assertFalse(value.contains("javascript:"), "Response should not contain javascript: for payload: " + payload);
                assertFalse(value.contains("onload="), "Response should not contain onload for payload: " + payload);
                assertFalse(value.contains("onclick="), "Response should not contain onclick for payload: " + payload);
            });
        }
    }
}
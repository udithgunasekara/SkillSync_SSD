package BackEnd.controller;

import BackEnd.service.CorsSecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * CORS Security Controller
 * Provides endpoints for CORS security management and monitoring
 */
@RestController
@RequestMapping("/Security/cors")
public class CorsSecurityController {
    
    @Autowired
    private CorsSecurityService corsSecurityService;
    
    /**
     * Get allowed origins for CORS
     * @return List of allowed origins
     */
    @GetMapping("/allowed-origins")
    public ResponseEntity<Map<String, Object>> getAllowedOrigins() {
        Map<String, Object> response = new HashMap<>();
        response.put("allowedOrigins", corsSecurityService.getAllowedOrigins());
        response.put("message", "Current CORS allowed origins");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Validate if an origin is allowed
     * @param origin The origin to validate
     * @return Validation result
     */
    @GetMapping("/validate-origin")
    public ResponseEntity<Map<String, Object>> validateOrigin(@RequestParam String origin) {
        Map<String, Object> response = new HashMap<>();
        boolean isAllowed = corsSecurityService.isOriginAllowed(origin);
        
        response.put("origin", origin);
        response.put("allowed", isAllowed);
        response.put("message", isAllowed ? "Origin is allowed" : "Origin is not allowed");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get CORS security status
     * @return CORS security configuration status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getCorsStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("corsEnabled", true);
        response.put("securityFilterActive", true);
        response.put("allowedOriginsCount", corsSecurityService.getAllowedOrigins().length);
        response.put("message", "CORS security is active and configured");
        
        return ResponseEntity.ok(response);
    }
}
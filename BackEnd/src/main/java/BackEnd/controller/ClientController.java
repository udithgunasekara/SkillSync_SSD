package BackEnd.controller;

import BackEnd.DTO.ClientDTO;
import BackEnd.DTO.LoginDTO;
import BackEnd.service.ClientService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@AllArgsConstructor
@RestController
@RequestMapping(path = "/Client")
public class ClientController {
    
    private ClientService clientService;

    // FIXED: Registration with CSRF protection (automatic via SecurityConfig)
    @PostMapping("/Registration")
    public ResponseEntity<Map<String, Object>> createClient(
            @RequestBody ClientDTO clientDTO,
            HttpServletRequest request) {
        
        // CSRF token is automatically validated by Spring Security
        ClientDTO saveClient = clientService.createClient(clientDTO);
        
        // Return success response with CSRF token for next request
        Map<String, Object> response = new HashMap<>();
        response.put("client", saveClient);
        response.put("message", "Client registered successfully");
        
        // Include new CSRF token if needed
        CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrf != null) {
            response.put("csrfToken", csrf.getToken());
        }
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Login endpoint (CSRF exempt for initial authentication)
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody LoginDTO loginDTO,
            HttpServletRequest request) {
        
        Long id = clientService.validateLogin(loginDTO);
        Map<String, Object> response = new HashMap<>();
        
        if (id != null) {
            response.put("id", id.toString());
            response.put("message", "Login successful");
            
            // Provide CSRF token for subsequent requests
            CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
            if (csrf != null) {
                response.put("csrfToken", csrf.getToken());
                response.put("csrfHeaderName", csrf.getHeaderName());
            }
            
            return ResponseEntity.ok(response);
        }
        
        response.put("error", "Invalid credentials");
        return ResponseEntity.status(401).body(response);
    }

    // FIXED: Protected endpoint with automatic CSRF validation
    @GetMapping("/allclients")
    public ResponseEntity<List<ClientDTO>> getAllClients(){
        List<ClientDTO> clients = clientService.getAllClients();
        return ResponseEntity.ok(clients);
    }
}

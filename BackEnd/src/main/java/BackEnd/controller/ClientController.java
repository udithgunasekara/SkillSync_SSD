package BackEnd.controller;

import BackEnd.DTO.ClientDTO;
import BackEnd.DTO.LoginDTO;
import BackEnd.DTO.AuthResponse;
import BackEnd.Config.JwtUtil;
import BackEnd.service.ClientService;
import BackEnd.service.LoginAttemptService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping(path = "/Client")
public class ClientController {
    private ClientService clientService;
    private JwtUtil jwtUtil;
    private LoginAttemptService loginAttemptService;

    //Client Registration
    @PostMapping("/Registration")
    public ResponseEntity<ClientDTO> createClient(@RequestBody ClientDTO clientDTO){
        ClientDTO saveClient = clientService.createClient(clientDTO);

        //can we make here a another service function for save usercredentials data (username, role, password))
        return new ResponseEntity<>(saveClient, HttpStatus.CREATED);

    }

    //Client Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDTO loginDTO, HttpServletRequest request, HttpServletResponse response) {
        String clientIp = loginAttemptService.getClientIpAddress(request);
        
        if (loginAttemptService.isBlocked(clientIp, loginDTO.getUsername())) {
            return ResponseEntity.status(429).body(new AuthResponse("Too many failed attempts. Please try again after 15 minutes.", null));
        }
        
        Long id = clientService.validateLogin(loginDTO);
        if (id != null) {
            loginAttemptService.resetAttempts(clientIp, loginDTO.getUsername());
            
            String token = jwtUtil.generateToken(loginDTO.getUsername(), "client");
            
            Cookie authCookie = new Cookie("_auth", token);
            authCookie.setHttpOnly(true);
            authCookie.setPath("/");
            authCookie.setMaxAge(86400);
            response.addCookie(authCookie);
            
            return ResponseEntity.ok(new AuthResponse("Login successful", "client"));
        }
        
        loginAttemptService.recordFailedAttempt(clientIp, loginDTO.getUsername());
        return ResponseEntity.status(401).body(new AuthResponse("Unauthorized", null));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        String token = extractTokenFromCookie(request);
        if (token != null) {
            jwtUtil.blacklistToken(token);
        }
        
        Cookie authCookie = new Cookie("_auth", "");
        authCookie.setMaxAge(0);
        authCookie.setPath("/");
        response.addCookie(authCookie);
        
        return ResponseEntity.ok("Logged out successfully");
    }

    private String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("_auth".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    //url: http://localhost:8080/Client/allclients
    @GetMapping("/allclients")
    public ResponseEntity<List<ClientDTO>> getAllClients(){
        List<ClientDTO> clients = clientService.getAllClients();
        return ResponseEntity.ok(clients);

    }
}

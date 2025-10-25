package BackEnd.controller;

import BackEnd.DTO.ClientDTO;
import BackEnd.DTO.FreelancerDTO;
import BackEnd.DTO.LoginDTO;
import BackEnd.service.ClientService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@CrossOrigin
@RequestMapping(path = "/Client")
public class ClientController {
    private ClientService clientService;

    //FIXED: Client Registration with input validation
    @PostMapping("/Registration")
    public ResponseEntity<ClientDTO> createClient(@RequestBody ClientDTO clientDTO){
        // Validate username format - prevent SQL injection
        if (clientDTO.getUserName() == null || !clientDTO.getUserName().matches("^[a-zA-Z0-9_]{3,50}$")) {
            throw new IllegalArgumentException("Invalid username format. Only alphanumeric characters and underscore allowed (3-50 characters)");
        }
        
        ClientDTO saveClient = clientService.createClient(clientDTO);
        return new ResponseEntity<>(saveClient, HttpStatus.CREATED);
    }

    //FIXED: Client Login with input validation to prevent SQL injection
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        // Validate login credentials format
        if (loginDTO.getUsername() == null || !loginDTO.getUsername().matches("^[a-zA-Z0-9_]{3,50}$")) {
            throw new IllegalArgumentException("Invalid username format");
        }
        if (loginDTO.getPassword() == null || loginDTO.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        
        Long id = clientService.validateLogin(loginDTO);
        if (id != null) {
            String idAsString = Long.toString(id);
            return ResponseEntity.ok(idAsString);
        }
        return ResponseEntity.status(401).body("Unauthorized");
    }

    //url: http://localhost:8080/Client/allclients
    @GetMapping("/allclients")
    public ResponseEntity<List<ClientDTO>> getAllClients(){
        List<ClientDTO> clients = clientService.getAllClients();
        return ResponseEntity.ok(clients);

    }
}

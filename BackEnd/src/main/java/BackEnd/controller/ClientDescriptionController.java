package BackEnd.controller;

import BackEnd.DTO.ClientDescriptionDTO;
import BackEnd.entity.ClientDescription;
import BackEnd.service.ClientDescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/Client/Description")
public class ClientDescriptionController {
    @Autowired
    private ClientDescriptionService clientDescriptionService;

    @PostMapping
    public ResponseEntity<ClientDescriptionDTO> saveClientDescription(@RequestBody ClientDescription clientDescription) {
        ClientDescriptionDTO savedDescription = clientDescriptionService.saveClientDescription(clientDescription);
        return ResponseEntity.ok(savedDescription);
    }

    @GetMapping("/{username}")
    public ResponseEntity<ClientDescriptionDTO> getClientDescriptionByUsername(@PathVariable String username) {
        return ResponseEntity.ok(clientDescriptionService.getClientDescriptionByUsername(username));
    }
}

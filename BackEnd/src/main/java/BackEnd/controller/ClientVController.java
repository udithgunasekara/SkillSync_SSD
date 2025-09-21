package BackEnd.controller;

import BackEnd.DTO.ClientVDTO;
import BackEnd.service.ClientVService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/clients")
public class ClientVController {

    @Autowired
    private ClientVService clientService;

    @GetMapping("/{username}")
    public ClientVDTO getClientById(@PathVariable String username) {
        return clientService.getClientByUsername(username);
    }

    @DeleteMapping("/{id}")
    public void deleteClientById(@PathVariable Long id) {
        clientService.deleteClientById(id);
    }
}
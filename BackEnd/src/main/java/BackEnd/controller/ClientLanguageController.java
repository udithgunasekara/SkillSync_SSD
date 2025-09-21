package BackEnd.controller;

import BackEnd.DTO.ClientLanguageDTO;
import BackEnd.entity.ClientLanguage;
import BackEnd.service.ClientLanguageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/client/language")
public class ClientLanguageController {
    @Autowired
    private ClientLanguageService clientLanguageService;

    @PostMapping
    public void addLanguageForClient(@RequestBody ClientLanguage clientLanguage) {
        clientLanguageService.addClientLanguage(clientLanguage);
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<ClientLanguageDTO>> getAllLanguagesForClient(@PathVariable String username) {
        List<ClientLanguageDTO> languages = clientLanguageService.getLanguagesByUsername(username);
        return ResponseEntity.ok(languages);
    }

    @DeleteMapping("/language/{username}/{language}")
    public void deleteByClientIdAndLanguage(@PathVariable String username, @PathVariable String language) {
        clientLanguageService.deleteByusernameAndLanguage(username, language);
    }
}
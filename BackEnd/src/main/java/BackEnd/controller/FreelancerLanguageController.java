package BackEnd.controller;

import BackEnd.DTO.FreelancerLanguageDTO;
import BackEnd.entity.FreelancerLanguage;
import BackEnd.service.FreelancerLanguageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/Freelancer/language")
public class FreelancerLanguageController {
    @Autowired
    private FreelancerLanguageService freelancerLanguageService;

    @PostMapping
    public FreelancerLanguageDTO addLanguageForFreelancer(@RequestBody FreelancerLanguage freelancerLanguage) {
        return freelancerLanguageService.addFreelancerLanguage(freelancerLanguage);
    }


    @GetMapping("/{username}")
    public List<FreelancerLanguageDTO> getAllLanguagesForFreelancer(@PathVariable String username) {
        return freelancerLanguageService.getAllLanguagesForFreelancer(username);
    }
    @DeleteMapping("/{username}/{language}")
    public ResponseEntity<Void> deleteByFreelancerIdAndLanguage(
            @PathVariable String username,
            @PathVariable String language) {
        freelancerLanguageService.deleteByusernameAndLanguage(username, language);
        return ResponseEntity.noContent().build();
    }
}
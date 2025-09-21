package BackEnd.controller;

import BackEnd.DTO.FreelancerDescriptionDTO;
import BackEnd.entity.FreelancerDescription;
import BackEnd.service.FreelancerDescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/Freelancer/Description")
public class FreelancerDescriptionController {
    @Autowired
    private FreelancerDescriptionService freelancerDescriptionService;

    @PostMapping("/{username}")
    public void addFreelancerDescription(@PathVariable String username, @RequestBody FreelancerDescription freelancerDescription) {
        freelancerDescriptionService.addFreelancerDescription(username,freelancerDescription);
    }

    @GetMapping("/{username}")
    public FreelancerDescriptionDTO getFreelancerDescriptionByusername(@PathVariable String username) {
        return freelancerDescriptionService.getFreelancerDescriptionByUsername(username);
    }
}
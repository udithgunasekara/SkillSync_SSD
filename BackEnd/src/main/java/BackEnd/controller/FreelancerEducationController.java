package BackEnd.controller;

import BackEnd.DTO.FreelancerEducationDTO;
import BackEnd.entity.FreelancerEducation;
import BackEnd.service.FreelancerEducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/freelancer/education")
public class FreelancerEducationController {

    @Autowired
    private FreelancerEducationService freelancerEducationService;

    @GetMapping("/{username}/get")
    public List<FreelancerEducationDTO> getEducationByUsername(@PathVariable String username) {
        return freelancerEducationService.getEducationByUsername(username);
    }

    @PostMapping("/{username}")
    public FreelancerEducationDTO addEducationForFreelancer(
            @PathVariable String username, @RequestBody FreelancerEducation freelancerEducation) {
        return freelancerEducationService.addFreelancerEducation(username, freelancerEducation);
    }

    @DeleteMapping("/{username}/{Id}")
    public void deleteFreelancerEducationById(@PathVariable String username,@PathVariable Long Id) {
        freelancerEducationService.deleteFreelancerEducationByusernameandId(username,Id);
    }
}
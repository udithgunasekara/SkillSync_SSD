package BackEnd.controller;

import BackEnd.DTO.FreelancerSkillsDTO;
import BackEnd.entity.FreelancerSkills;
import BackEnd.service.FreelancerSkillsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/freelancer/skills")
public class FreelancerSkillsController {

    @Autowired
    private FreelancerSkillsService freelancerSkillsService;

    @PostMapping("/")
    public FreelancerSkillsDTO addSkillForFreelancer(@RequestBody FreelancerSkills freelancerSkills) { // Updated parameter name to lowercase skill
        return freelancerSkillsService.addFreelancerSkill(freelancerSkills);
    }

    @GetMapping("/{username}/getall")
    public List<FreelancerSkillsDTO> getAllSkillsForFreelancer(@PathVariable String username) {
        return freelancerSkillsService.getAllSkillsForFreelancer(username); // Updated method call
    }

    @DeleteMapping("/{username}/{skill}")
    public void deleteByFreelancerIdAndSkill(
            @PathVariable String username, @PathVariable String skill) {
        freelancerSkillsService.deleteByusernameAndSkill(username, skill);
    }
}
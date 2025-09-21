package BackEnd.controller;

import BackEnd.DTO.FreelancerVDTO;
import BackEnd.service.FreelancerVService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/freelancers")
public class FreelancerVController {

    @Autowired
    private FreelancerVService freelancerVService;

    @GetMapping("/getallfreelancer")
    public List<FreelancerVDTO> getAllFreelancers() {
        return freelancerVService.getAllFreelancers();
    }

    @GetMapping("/{username}")
    public FreelancerVDTO getFreelancerByusername(@PathVariable String username) {
        return freelancerVService.getFreelancerByusername(username);
    }

    @DeleteMapping("/{id}")
    public void deleteFreelancerById(@PathVariable Long id) {
        freelancerVService.deleteFreelancerById(id);
    }
}
package BackEnd.controller;

import BackEnd.DTO.FreelancerDTO;
import BackEnd.service.ApplicationService;
import BackEnd.service.FreelancerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/freelancer/dashboard")
public class ApplicationController {

    private FreelancerService freelancerService;
    private ApplicationService applicationService;

//    @GetMapping("/{UserApplication}")
//    public ResponseEntity<List<FreelancerApplicationDTO>> getapplication (@PathVariable ("UserApplication") String userName){
//
//
//        return
//    }

    @GetMapping("/{userName}")
    public ResponseEntity<FreelancerDTO> getFreelancerInfor (@PathVariable ("userName") String userName){

        FreelancerDTO freelancerDTO =applicationService.getFreelancerByUsername(userName);


        return ResponseEntity.ok(freelancerDTO);
    }

    //Get "In Progress" status of the freealancers list
//    @GetMapping("/inProgress")
//    public ResponseEntity<List<FreelancerDTO>> getInProgressFreelancers(){
//        List<FreelancerDTO> freelancer = freelancerService.getInProgressFreelancers();
//        return ResponseEntity.ok(freelancer);
//    }


}

package BackEnd.controller;

import BackEnd.DTO.PaymentDTO;
import BackEnd.DTO.paymentDetailsFreelancerDTO;
import BackEnd.service.paymentDetailsFreelancerService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping(path="/details")
public class paymentDetailsFController {

    private paymentDetailsFreelancerService paymentDetailsFreelancerService;

    @PostMapping
    public ResponseEntity<paymentDetailsFreelancerDTO> addDetails(@RequestBody paymentDetailsFreelancerDTO paymentDetailsFreelancerDTO){
        paymentDetailsFreelancerDTO savedPayDetailsF = paymentDetailsFreelancerService.addDetails(paymentDetailsFreelancerDTO);
        return new ResponseEntity<>(savedPayDetailsF, HttpStatus.CREATED);
    }

    @GetMapping("/{userName}")
    public ResponseEntity<paymentDetailsFreelancerDTO> getDetailsByUserName(@PathVariable("userName") String userName){
        paymentDetailsFreelancerDTO paymentDetailsFreelancerDTO = paymentDetailsFreelancerService.getDetailsByUserName(userName);
        return ResponseEntity.ok(paymentDetailsFreelancerDTO);
    }




    @PutMapping("/{userName}")
    public ResponseEntity<paymentDetailsFreelancerDTO> updateDetails(@PathVariable("userName") String userName,
                                                                     @RequestBody paymentDetailsFreelancerDTO updatedDetails){
        paymentDetailsFreelancerDTO paymentDetailsFreelancerDTO = paymentDetailsFreelancerService.updateDetails(userName, updatedDetails);

        return ResponseEntity.ok(paymentDetailsFreelancerDTO);
    }

    //delete details
    @DeleteMapping("/{userName}")
    public ResponseEntity<String> deleteDetails(@PathVariable("userName") String userName){
        paymentDetailsFreelancerService.deleteDetails(userName);
        return ResponseEntity.ok("Details deleted sucessfully!");
    }

}

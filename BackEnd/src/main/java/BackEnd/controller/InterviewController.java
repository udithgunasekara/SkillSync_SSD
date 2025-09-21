package BackEnd.controller;

import BackEnd.DTO.InterviewDTO;
import BackEnd.service.InterviewService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    private InterviewService interviewService;

    //Build Get Interview REST API
    @PostMapping("{id}")
    public ResponseEntity<InterviewDTO> saveResevartion(@PathVariable("id") Long freelancerId, @RequestBody InterviewDTO interviewDTO){
        InterviewDTO savedInterviewDTO = interviewService.saveReservation(freelancerId, interviewDTO);
        return new ResponseEntity<>(savedInterviewDTO, HttpStatus.CREATED);
    }

    //Build Get Interview By UserName REST API
    @GetMapping("{id}")
    public ResponseEntity<InterviewDTO> getResevationByUserName(@PathVariable("id") Long userId){
        InterviewDTO interviewDTO = interviewService.getReservationByUserName(userId);
        return ResponseEntity.ok(interviewDTO);
    }

    //Build Get All Interviews REST API
    @GetMapping
    public ResponseEntity<List<InterviewDTO>> getInterViewDTO(){
        List<InterviewDTO> interviewDTOS = interviewService.getAllReservations();
        return ResponseEntity.ok(interviewDTOS);
    }
}

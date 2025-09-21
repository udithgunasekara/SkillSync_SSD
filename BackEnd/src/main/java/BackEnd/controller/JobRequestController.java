package BackEnd.controller;

import BackEnd.DTO.JobRequestDto;
import BackEnd.service.JobRequestService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController //handle HTTP requests
@RequestMapping("/api/jobRequests") //define the base URL for all the REST APIs

public class JobRequestController {

    private JobRequestService jobRequestService;

    @PostMapping
    public ResponseEntity<JobRequestDto> applyJob(@RequestBody JobRequestDto jobRequestDto){
        JobRequestDto savedJobRequesting = jobRequestService.applyJob(jobRequestDto);
        return new ResponseEntity<>(savedJobRequesting, HttpStatus.CREATED);
    }

    @GetMapping("{Id}")
    public ResponseEntity<JobRequestDto> getJobRequestById(@PathVariable("Id") int requestid){
        JobRequestDto jobRequestDto = jobRequestService.getJobRequestById(requestid);
        return ResponseEntity.ok(jobRequestDto);
    }

    @GetMapping("/getalljobrequests")
    public ResponseEntity<List<JobRequestDto>> getAllJobRequests(){
        List<JobRequestDto> jobRequests = jobRequestService.getAllJobRequests();
        return ResponseEntity.ok(jobRequests);
    }

    @PutMapping("{Id}")
    public ResponseEntity<JobRequestDto> updateJobRequest(@PathVariable("Id") int requestid,
                                                          @RequestBody JobRequestDto updatedJobRequest){
        JobRequestDto jobRequestDto = jobRequestService.updateJobRequest(requestid, updatedJobRequest);
        return ResponseEntity.ok(jobRequestDto);
    }

    @DeleteMapping("{Id}")
    public ResponseEntity<String> deleteJobRequest(@PathVariable("Id") int requestid){
        jobRequestService.deleteJobRequest(requestid);
        return ResponseEntity.ok("Jobrequest deleted successfully!.");
    }



}

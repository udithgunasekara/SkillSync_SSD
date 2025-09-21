package BackEnd.controller;

import lombok.AllArgsConstructor;
import BackEnd.DTO.JobDto;
import BackEnd.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@CrossOrigin("http://localhost:3000")
@AllArgsConstructor
@RestController //handle HTTP requests
@RequestMapping("/api/jobs") //define the base URL for all the REST APIs

public class JobController {

    private JobService jobService;

    //Build add Job REST API
    @PostMapping//map the incoming HTTP post request to createJobListing method
    public ResponseEntity<JobDto> createJobListing(@RequestBody JobDto jobDto){
        //@RequestBody - extract the Json from the HTTP request and convert that Json into jobDto java object

        JobDto savedJobListing = jobService.createJobListing(jobDto);
        return new ResponseEntity<>(savedJobListing, HttpStatus.CREATED);
    }

    //Build get JobPosting REST API
    @GetMapping("{Id}") //map the incoming HTTP get request to getJobById method
    public ResponseEntity<JobDto> getJobPostingById(@PathVariable("Id") int id){
        JobDto jobDto = jobService.getJobPostingById(id);
        return ResponseEntity.ok(jobDto);
    }

    //Build Get All Jobs REST API
    @GetMapping("/getalljobposts")
    public ResponseEntity<List<JobDto>> getAllJobListings(){
        List<JobDto> jobs = jobService.getAllJobListings();
        return ResponseEntity.ok(jobs);
    }

    //Build Update JobPosting REST API
    @PutMapping("{Id}") // map the incoming HTTP put request to updateJobPosting method
    public ResponseEntity<JobDto> updateJobPosting(@PathVariable("Id") int id,
                                                   @RequestBody JobDto updatedJobPosting){
        JobDto jobDto = jobService.updateJobPosting(id, updatedJobPosting);
        return ResponseEntity.ok(jobDto);
    }

    //Build Delete JobPosting REST API
    @DeleteMapping("{Id}") //map the incoming HTTP delete request to deleteJobPosting method
    public ResponseEntity<String> deleteJobPosting(@PathVariable("Id") int id){
        jobService.deleteJobPosting(id);
        return ResponseEntity.ok("JobPosting deleted successfully!.");
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobDto>> searchJobs(@RequestParam String query) {
        try {
            List<JobDto> jobs = jobService.searchJobs(query);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}

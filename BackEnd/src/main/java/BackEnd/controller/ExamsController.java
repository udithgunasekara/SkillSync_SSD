package BackEnd.controller;


import BackEnd.DTO.ExamsDTO;
import BackEnd.service.ExamsService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping("/api/exams")
public class ExamsController {

    private ExamsService examsService;

    //Build Create Exams REST API
    @PostMapping
    public ResponseEntity<ExamsDTO> createExam(@RequestParam("file")MultipartFile file,
                                               @RequestParam String examName,
                                               @RequestParam String examDescription,
                                               @RequestParam Long noOfAttempts,
                                               @RequestParam Long timeLimit,
                                               @RequestParam Long creditPoint) throws IOException {
        ExamsDTO examsDTO = new ExamsDTO();
        examsDTO.setExamName(examName);
        examsDTO.setExamDescription(examDescription);
        examsDTO.setNoOfAttempts(noOfAttempts);
        examsDTO.setTimeLimit(timeLimit);
        examsDTO.setCreditPoint(creditPoint);
        examsDTO.setBadgeName(file.getOriginalFilename());
        examsDTO.setBadge(file.getBytes());
        ExamsDTO savedExamDTO = examsService.createExam(examsDTO);
        return new ResponseEntity<>(savedExamDTO, HttpStatus.CREATED);
    }

    //Build Get Exams REST API
    @GetMapping("{id}")
    public ResponseEntity<ExamsDTO> getExamById(@PathVariable("id") Long examId){
        ExamsDTO examsDTO = examsService.getExamById(examId);
        return ResponseEntity.ok(examsDTO);
    }

    //Build Update Exams REST API
    @PutMapping("{id}")
    public ResponseEntity<ExamsDTO> updateExamById(@PathVariable("id") Long examId,
                                                   @RequestParam("file") MultipartFile file,
                                                   @RequestParam String examName,
                                                   @RequestParam String examDescription,
                                                   @RequestParam Long noOfAttempts,
                                                   @RequestParam Long timeLimit,
                                                   @RequestParam Long creditPoint) throws IOException {
        ExamsDTO updatedExamsDTO = new ExamsDTO();
        updatedExamsDTO.setExamName(examName);
        updatedExamsDTO.setExamDescription(examDescription);
        updatedExamsDTO.setNoOfAttempts(noOfAttempts);
        updatedExamsDTO.setTimeLimit(timeLimit);
        updatedExamsDTO.setCreditPoint(creditPoint);
        updatedExamsDTO.setBadgeName(file.getOriginalFilename());
        updatedExamsDTO.setBadge(file.getBytes());
        ExamsDTO examsDTO = examsService.updateExamById(examId, updatedExamsDTO);
        return ResponseEntity.ok(examsDTO);
    }

    //Build Delete Exams REST API
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteExamById(@PathVariable("id") Long examid){
        examsService.deleteExamById(examid);
        return ResponseEntity.ok("Exam Deleted Successfully!");
    }

    //Build GetAll Exams REST API
    @GetMapping
    public ResponseEntity<List<ExamsDTO>> getAllExams(){
        List<ExamsDTO> examsDTO = examsService.getAllExams();
        return ResponseEntity.ok(examsDTO);
    }
}

package BackEnd.controller;

import BackEnd.DTO.UserResultDTO;
import BackEnd.service.UserResultService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping("/api/userResult")
public class UserResultController {

    private UserResultService userResultService;

    @PostMapping
    public ResponseEntity<UserResultDTO> saveResult(@RequestBody UserResultDTO userResultDTO){
        UserResultDTO savedUserResultDTO = userResultService.saveUSerResult(userResultDTO);
        return new ResponseEntity<>(savedUserResultDTO, HttpStatus.CREATED);
    }

    @GetMapping("{username}/{id}")
    public ResponseEntity<UserResultDTO> getUserResultById(@PathVariable("username") String userName, @PathVariable("id") Long examId){
        UserResultDTO userResultDTO = userResultService.getSavedResultById(userName, examId);
        return ResponseEntity.ok(userResultDTO);
    }

    //Build Get Exam By Exam Id REST API
    @GetMapping
    public ResponseEntity<List<UserResultDTO>> getUserResultByExamId(){
        List<UserResultDTO> userResultDTO = userResultService.getSavedResultByExamId();
        return ResponseEntity.ok(userResultDTO);
    }

    @GetMapping("{username}")
    public ResponseEntity<List<UserResultDTO>> getUserResultByuserName(@PathVariable("username") String userName){
        List<UserResultDTO> userResultDTO = userResultService.getSavedResultByUserName(userName);
        return ResponseEntity.ok(userResultDTO);
    }

}

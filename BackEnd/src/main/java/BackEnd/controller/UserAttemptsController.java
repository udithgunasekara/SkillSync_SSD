package BackEnd.controller;


import BackEnd.DTO.UserAttemptsDTO;
import BackEnd.service.UserAttemptsService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping("/api/userAttempts")
public class UserAttemptsController {

    private UserAttemptsService userAttemptsService;

    @PostMapping
    public ResponseEntity<UserAttemptsDTO> saveAttempt(@RequestBody UserAttemptsDTO userAttemptsDTO){
        UserAttemptsDTO savedUserAttemptsDTO = userAttemptsService.saveAttempt(userAttemptsDTO);
        return new ResponseEntity<>(savedUserAttemptsDTO, HttpStatus.CREATED);
    }

    @GetMapping("{username}/{id}")
    public ResponseEntity<UserAttemptsDTO> getUserAttemptsById(@PathVariable("username") String userName, @PathVariable("id") Long examId){
        UserAttemptsDTO userAttemptsDTO = userAttemptsService.getUserAttemptsById(userName, examId);
        return ResponseEntity.ok(userAttemptsDTO);
    }

    @PutMapping("{username}/{id}")
    public ResponseEntity<UserAttemptsDTO> updateUserAttemptsById(@PathVariable("username") String userName, @PathVariable("id") Long examId, @RequestBody UserAttemptsDTO updatedUserAttemptsDTO){
        UserAttemptsDTO userAttemptsDTO = userAttemptsService.updateUserAttemptsById(userName, examId, updatedUserAttemptsDTO);
        return ResponseEntity.ok(userAttemptsDTO);
    }
}

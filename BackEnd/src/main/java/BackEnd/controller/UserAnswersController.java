package BackEnd.controller;


import BackEnd.DTO.UserAnswersDTO;
import BackEnd.service.UserAnswersService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping("/api/userAnswers")
public class UserAnswersController {

    private UserAnswersService userAnswersService;

    //Build Save UserAnswers REST API
    @PostMapping
    public ResponseEntity<UserAnswersDTO> saveAnswers(@RequestBody UserAnswersDTO userAnswersDTO){
        UserAnswersDTO savedUserAnswersDTO = userAnswersService.saveAnswer(userAnswersDTO);
        return new ResponseEntity<>(savedUserAnswersDTO, HttpStatus.CREATED);
    }
}

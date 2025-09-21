package BackEnd.controller;


import BackEnd.DTO.QuestionsDTO;
import BackEnd.service.QuestionsService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping("/api/questions")
public class QuestionsController {

    private QuestionsService questionsService;

    //Build create questions REST API
    @PostMapping("{id}")
    public ResponseEntity<QuestionsDTO> createQuestion(@PathVariable("id") Long examId, @RequestBody QuestionsDTO questionsDTO){
        QuestionsDTO savedQuestionDTO = questionsService.createQuestion(examId, questionsDTO);
        return new ResponseEntity<>(savedQuestionDTO, HttpStatus.CREATED);
    }

    //Build Get Question REST API
    @GetMapping("{id}")
    public ResponseEntity<QuestionsDTO> getQuestionById(@PathVariable("id") Long questionId){
        QuestionsDTO questionsDTO = questionsService.getQuestionById(questionId);
        return ResponseEntity.ok(questionsDTO);
    }

    //Build Update Question REST API
    @PutMapping("{id}")
    public ResponseEntity<QuestionsDTO> updateQuestionById(@PathVariable("id") Long questionId, @RequestBody QuestionsDTO updatedQuestionsDTO){
        QuestionsDTO questionsDTO = questionsService.updateQuestionById(questionId, updatedQuestionsDTO);
        return ResponseEntity.ok(questionsDTO);
    }

    //Build Delete Question REST API
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteQuestionById(@PathVariable("id") Long questionId){
        questionsService.deleteQuestionById(questionId);
        return ResponseEntity.ok("Question Deleted Successfully!");
    }
}

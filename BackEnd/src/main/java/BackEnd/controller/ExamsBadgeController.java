package BackEnd.controller;

import BackEnd.DTO.ExamsDTO;
import BackEnd.service.ExamsService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping("/api/exams/badge")
public class ExamsBadgeController {

    private ExamsService examsService;

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImageById(@PathVariable("id") Long id) {
        ExamsDTO examsDTO = examsService.getExamById(id);
        if (examsDTO != null) {
            return ResponseEntity.ok()
                    .header("Content-Disposition", "inline; filename=\"" + examsDTO.getBadgeName() + "\"")
                    .body(examsDTO.getBadge());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

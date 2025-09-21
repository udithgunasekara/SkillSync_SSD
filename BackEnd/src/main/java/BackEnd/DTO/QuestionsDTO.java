package BackEnd.DTO;

import BackEnd.entity.Options;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionsDTO {
    private Long QuestionId;
    private String QuestionTxt;
    private Long ExamId;
    private List<Options> options;
}

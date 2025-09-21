package BackEnd.DTO;

import BackEnd.entity.Questions;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExamsDTO {
    private Long id;
    private String examName;
    private String examDescription;
    private Long noOfAttempts;
    private Long timeLimit;
    private String badgeName;
    private byte[] badge;
    private Long creditPoint;
    private List<Questions> questions;
}
package BackEnd.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAnswersDTO {
    private String userNamePk;
    private Long questionIdPk;
    private Long selectedOptionId;
}

package BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "userAnswers")
@IdClass(UserAnswerPKId.class)
public class UserAnswers {
    @Id
    private String userNamePk;
    @Id
    private Long questionIdPk;
    private Long selectedOptionId;
}

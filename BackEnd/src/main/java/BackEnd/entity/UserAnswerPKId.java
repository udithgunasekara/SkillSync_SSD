package BackEnd.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserAnswerPKId implements Serializable {
    private String userNamePk;
    private Long questionIdPk;
}

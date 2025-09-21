package BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "userResult")
@IdClass(UserResultPKId.class)
public class UserResult {
    @Id
    private String userNamePk;
    @Id
    private Long examIdPk;
    private String result;
}

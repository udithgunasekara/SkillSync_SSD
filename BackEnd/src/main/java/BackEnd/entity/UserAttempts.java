package BackEnd.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "userAttempts")
@IdClass(UserAttemptsPKId.class)
public class UserAttempts {
    @Id
    private String userName;
    @Id
    private Long examId;
    private Long noOfAttempts;
}

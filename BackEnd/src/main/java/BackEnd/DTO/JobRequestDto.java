package BackEnd.DTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class JobRequestDto {

    private int requestid;
    private String freelancername;
    private String message;
    private String status;

}

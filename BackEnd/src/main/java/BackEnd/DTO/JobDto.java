package BackEnd.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class JobDto {

    private int id;
    private String jobTitle;
    private String skills;
    private String scope;
    private String budget;
    private String description;
    private Timestamp postedTime;
    private String customerUsername;

}

package BackEnd.DTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.sql.Time;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewDTO {
    private Long interviewId;
    private String category;
    private Date date;
    private Time time;
    private String meetingLink;
    private Long freelancerFk;
}

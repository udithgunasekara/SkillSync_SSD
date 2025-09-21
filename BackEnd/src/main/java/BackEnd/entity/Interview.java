package BackEnd.entity;

import jakarta.persistence.*;
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
@Entity
@Table(name = "interview")
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long interviewId;
    private String category;

    @Column(columnDefinition = "DATE")
    private Date date;

    @Column(columnDefinition = "TIME")
    private Time time;

    private String meetingLink;

    @Column(name = "freelancer_fk")
    private Long freelancerFk;
}

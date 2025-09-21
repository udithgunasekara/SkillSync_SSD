package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Exams")
public class Exams {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "exam_name")
    private String examName;

    @Column(name = "exam_description", length = 1000)
    private String examDescription;

    @Column(name = "attempts")
    private Long noOfAttempts;

    @Column(name = "timeLimit")
    private Long timeLimit;

    private String badgeName;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] badge;

    private Long creditPoint;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "exam_fk")
    private List<Questions> questions;
}
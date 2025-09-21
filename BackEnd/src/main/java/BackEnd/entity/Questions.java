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
@Table(name = "Questions")
public class Questions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long QuestionId;

    @Column(name =  "question_txt")
    private String QuestionTxt;

    @Column(name = "exam_fk")
    private Long ExamId;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "question_fk")
    private List<Options> options;

}

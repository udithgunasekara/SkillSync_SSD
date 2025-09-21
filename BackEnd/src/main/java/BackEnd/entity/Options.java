package BackEnd.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Options")
public class Options {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long optionId;

    @Column(name = "option_txt")
    private String optionTxt;

    @Column(name = "question_fk")
    private Long questionId;
}

package BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "qualification")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QualificationHandler {
    // Images are in here
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String userName;
    private String title;

    private String name;
    private String type;
    private String startDate;
    private String endDate;
    private String status = "UnderReview";

    @Lob
    @Column(name = "image", length = 1999999999)
    private byte[] image;

}

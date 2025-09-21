package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Rating_Review", schema = "demo")
public class Rating {
    //primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private String userID;

    private Float rating;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private Integer projectID;

    private String review;

    private Integer starRating;  // Add this field


}


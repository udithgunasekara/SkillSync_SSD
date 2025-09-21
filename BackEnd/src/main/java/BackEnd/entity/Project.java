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
@Table(name = "Project", schema = "demo")
public class Project {
    //primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private String freelanceID;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private String clientID;

    private String description;

}


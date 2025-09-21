package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.sql.Timestamp; // Import Timestamp class

@Getter
@Setter
@NoArgsConstructor //default constructor
@AllArgsConstructor //parameterized constructor
@Entity //class as a JPA entity
@Table(name = "jobrequest")

public class JobRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //database auto increment feature
    private int requestid;

    @Column(name = "freelancername")//database column maps with class field
    private String freelancername;

    @Column(name = "message")
    private String message;

    @Column(name = "status")
    private String status;

}

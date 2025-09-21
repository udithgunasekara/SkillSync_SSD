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
@Table(name = "JobListings")

public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //database auto increment feature
    private int id;

    @Column(name = "job_title")//database column maps with class field
    private String jobTitle;

    @Column(name = "required_skills")
    private String skills;

    @Column(name = "project_scope")
    private String scope;

    @Column(name = "Budget")
    private String budget;

    @Column(name = "Description")
    private String description;

    @Column(name = "Posted_time")
    private  Timestamp postedTime;

    @Column(name = "customer_username")
    private String customerUsername;

}

package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Entity
@Getter
@Setter
//@AllArgsConstructor
//@NoArgsConstructor
@Table(name = "freelancer_education")
public class FreelancerEducation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String institute;
    private String title;
    private String major;

    @Column(name = "grad_year", columnDefinition = "TIMESTAMP")
    private Date year;

    public FreelancerEducation(Long id, String username, String institute, String title, String major, Date year) {
        this.id = id;
        this.username = username;
        this.institute = institute;
        this.title = title;
        this.major = major;
        this.year = year;
    }

    public FreelancerEducation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getInstitute() {
        return institute;
    }

    public void setInstitute(String institute) {
        this.institute = institute;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public Date getYear() {
        return year;
    }

    public void setYear(Date year) {
        this.year = year;
    }
}
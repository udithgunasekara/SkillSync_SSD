package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Setter
@Getter
//@NoArgsConstructor
//@AllArgsConstructor
@Table(name = "freelancer_skills")
public class FreelancerSkills {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String skill;

    public FreelancerSkills(Long id, String username, String skill) {
        this.id = id;
        this.username = username;
        this.skill = skill;
    }

    public FreelancerSkills() {
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

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }
}
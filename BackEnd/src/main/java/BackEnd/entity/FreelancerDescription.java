package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
//@AllArgsConstructor
//@NoArgsConstructor
@Table(name = "freelancer_description")
public class FreelancerDescription {
    @Id
    private String username;
    @Column(columnDefinition = "TEXT")
    private String Description;

    public FreelancerDescription(String username, String description) {
        this.username = username;
        Description = description;
    }

    public FreelancerDescription() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }
}
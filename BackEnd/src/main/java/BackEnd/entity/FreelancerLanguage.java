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
@Table(name = "freelancer_language")
public class FreelancerLanguage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String language;

    public FreelancerLanguage(Long id, String username, String language) {
        this.id = id;
        this.username = username;
        this.language = language;
    }

    public FreelancerLanguage() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
package BackEnd.DTO;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
//@AllArgsConstructor
public class FreelancerLanguageDTO {
    private Long id;
    private String username;
    private String language;

    public FreelancerLanguageDTO(Long id, String username, String language) {
        this.id = id;
        this.username = username;
        this.language = language;
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
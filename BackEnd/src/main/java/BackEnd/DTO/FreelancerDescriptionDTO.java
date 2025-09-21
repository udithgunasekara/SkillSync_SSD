package BackEnd.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter/*
@AllArgsConstructor
@NoArgsConstructor*/
public class FreelancerDescriptionDTO {
    private String username;
    private String Description;

    public FreelancerDescriptionDTO(String username, String description) {
        this.username = username;
        Description = description;
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
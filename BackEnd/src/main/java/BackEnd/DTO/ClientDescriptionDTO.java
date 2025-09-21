package BackEnd.DTO;

import jakarta.persistence.Column;

public class ClientDescriptionDTO {
    private String username;
    @Column(columnDefinition = "TEXT")
    private String Description;

    public ClientDescriptionDTO(String username, String description) {
        this.username = username;
        Description = description;
    }

    public ClientDescriptionDTO() {
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
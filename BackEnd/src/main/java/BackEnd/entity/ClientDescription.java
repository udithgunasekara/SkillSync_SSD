package BackEnd.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "clients_description")
public class ClientDescription {
    @Id
    private String username;
    @Column(columnDefinition = "TEXT")
    private String Description;

    public ClientDescription() {
    }

    public ClientDescription(String username, String description) {
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
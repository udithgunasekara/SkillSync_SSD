package BackEnd.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "clients_language")
public class ClientLanguage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String username;
    private String language;

    public ClientLanguage() {
    }

    public ClientLanguage(Long id, String username, String language) {
        Id = id;
        this.username = username;
        this.language = language;
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
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
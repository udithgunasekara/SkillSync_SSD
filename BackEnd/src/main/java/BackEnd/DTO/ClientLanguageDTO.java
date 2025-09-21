package BackEnd.DTO;

public class ClientLanguageDTO {
    private Long Id;
    private String username;
    private String language;

    public ClientLanguageDTO(Long id, String username, String language) {
        Id = id;
        this.username = username;
        this.language = language;
    }

    public ClientLanguageDTO() {
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
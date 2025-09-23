package BackEnd.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

//Entity class
public class UserCredential {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private long userId;
   // @Column(nullable = false)
    private String userName;
    private String password;
    private String role ;
    
    // Additional fields for OAuth2 integration
    private String email;
    private String firstName;
    private String lastName;
    
    // OAuth2 specific fields
    private String googleId;
    private String oauth2Provider; // "google", "facebook", etc.
    private String profilePictureUrl;
    
    // Account status fields
    private boolean emailVerified = false;
    private boolean accountNonLocked = true;
    private boolean enabled = true;
    
    // Timestamp fields
    private LocalDateTime createdDate;
    private LocalDateTime lastLoginDate;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Ticket> tickets = new ArrayList<>();
    
    // Convenience methods
    public String getUsername() {
        return this.userName;
    }
    
    public void setUsername(String username) {
        this.userName = username;
    }
    
    public String getFullName() {
        if (firstName == null && lastName == null) {
            return userName;
        }
        return (firstName != null ? firstName : "") + 
               (lastName != null && !lastName.isEmpty() ? " " + lastName : "");
    }

}

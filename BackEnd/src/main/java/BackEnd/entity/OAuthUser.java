package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "oauth_users")
public class OAuthUser {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String googleId;  // Google's unique user ID
    
    @Column(nullable = false)
    private String email;
    
    private String firstName;
    private String lastName;
    private String profilePicture;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;  // FREELANCER, CLIENT, ADMIN
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    // Link to existing user data
    private String linkedUsername;  // Links to existing Freelancer/Client username
    
    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime lastLogin;
    
    @PrePersist
    public void prePersist() {
        if (lastLogin == null) {
            lastLogin = LocalDateTime.now();
        }
    }
    
    public enum UserRole {
        FREELANCER, CLIENT, ADMIN
    }
    
    // Convenience methods
    public String getFullName() {
        return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
    }
    
    public void updateLastLogin() {
        this.lastLogin = LocalDateTime.now();
    }
}
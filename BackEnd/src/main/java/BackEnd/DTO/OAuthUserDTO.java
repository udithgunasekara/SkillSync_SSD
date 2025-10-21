package BackEnd.DTO;

import BackEnd.entity.OAuthUser;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OAuthUserDTO {
    
    private Long id;
    private String googleId;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private OAuthUser.UserRole role;
    private Boolean isActive;
    private String linkedUsername;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    
    // Convenience methods
    public String getFullName() {
        return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
    }
}
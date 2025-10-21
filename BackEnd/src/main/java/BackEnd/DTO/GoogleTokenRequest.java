package BackEnd.DTO;

import BackEnd.entity.OAuthUser;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GoogleTokenRequest {
    private String idToken;  // JWT token from Google
    private OAuthUser.UserRole role;  // Role user wants to register as
    private String linkedUsername;  // Optional: link to existing account
}
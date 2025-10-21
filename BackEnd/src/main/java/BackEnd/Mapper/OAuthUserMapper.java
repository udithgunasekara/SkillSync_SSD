package BackEnd.Mapper;

import BackEnd.DTO.OAuthUserDTO;
import BackEnd.entity.OAuthUser;

public class OAuthUserMapper {
    
    public static OAuthUserDTO mapToOAuthUserDTO(OAuthUser oAuthUser) {
        return new OAuthUserDTO(
            oAuthUser.getId(),
            oAuthUser.getGoogleId(),
            oAuthUser.getEmail(),
            oAuthUser.getFirstName(),
            oAuthUser.getLastName(),
            oAuthUser.getProfilePicture(),
            oAuthUser.getRole(),
            oAuthUser.getIsActive(),
            oAuthUser.getLinkedUsername(),
            oAuthUser.getCreatedAt(),
            oAuthUser.getLastLogin()
        );
    }
    
    public static OAuthUser mapToOAuthUser(OAuthUserDTO oAuthUserDTO) {
        return new OAuthUser(
            oAuthUserDTO.getId(),
            oAuthUserDTO.getGoogleId(),
            oAuthUserDTO.getEmail(),
            oAuthUserDTO.getFirstName(),
            oAuthUserDTO.getLastName(),
            oAuthUserDTO.getProfilePicture(),
            oAuthUserDTO.getRole(),
            oAuthUserDTO.getIsActive(),
            oAuthUserDTO.getLinkedUsername(),
            oAuthUserDTO.getCreatedAt(),
            oAuthUserDTO.getLastLogin()
        );
    }
    
    // Create from Google OAuth data
    public static OAuthUser createFromGoogleData(String googleId, String email, String firstName, 
                                               String lastName, String profilePicture, OAuthUser.UserRole role) {
        OAuthUser user = new OAuthUser();
        user.setGoogleId(googleId);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setProfilePicture(profilePicture);
        user.setRole(role);
        user.setIsActive(true);
        return user;
    }
}
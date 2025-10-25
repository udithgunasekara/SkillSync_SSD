package BackEnd.repository;

import BackEnd.entity.UserCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserCredentialRepo extends JpaRepository<UserCredential, Long> {

    //find user credentials by username
    UserCredential findByUserName(String username);

    @Query(value = "SELECT * FROM user_credential WHERE user_name = :username", nativeQuery = true)
    Optional<UserCredential> findByUsername(@Param("username") String username);

    UserCredential findByUserNameAndRole(String userName, String role);
    
    // OAuth2 specific methods
    Optional<UserCredential> findByEmail(String email);
    
    Optional<UserCredential> findByProviderAndProviderId(String provider, String providerId);
    
    Optional<UserCredential> findByEmailAndProvider(String email, String provider);
}

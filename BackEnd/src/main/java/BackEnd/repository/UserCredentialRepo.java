package BackEnd.repository;

import BackEnd.entity.UserCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UserCredentialRepo extends JpaRepository<UserCredential, Long> {

    // SAFE: JPA method naming convention (automatically parameterized)
    Optional<UserCredential> findByUserName(String username);
    
    // FIXED: Proper named parameters with validation-ready methods
    @Query(value = "SELECT * FROM user_credential WHERE user_name = :username", nativeQuery = true)
    Optional<UserCredential> findByUsernameNative(@Param("username") String username);
    
    // SAFE: JPA method for role-based lookup
    Optional<UserCredential> findByUserNameAndRole(String userName, String role);
    
    // ADDED: Validation helper methods
    @Query(value = "SELECT COUNT(*) FROM user_credential WHERE user_name = :username", nativeQuery = true)
    Integer countByUsername(@Param("username") String username);
    
    // ADDED: Check if username exists (safe boolean check)
    boolean existsByUserName(String username);
    
    // DEPRECATED: Keep for backward compatibility
    @Deprecated
    @Query(value = "SELECT * FROM user_credential WHERE user_name = :username", nativeQuery = true)
    Optional<UserCredential> findByUsername(@Param("username") String username);
    
    // OAuth2 specific methods
    Optional<UserCredential> findByEmail(String email);
    Optional<UserCredential> findByGoogleId(String googleId);
    
    // Check existence methods for OAuth2
    boolean existsByEmail(String email);
    boolean existsByGoogleId(String googleId);
}

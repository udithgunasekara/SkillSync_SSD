package BackEnd.repository;

import BackEnd.entity.OAuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OAuthUserRepository extends JpaRepository<OAuthUser, Long> {
    
    // Find user by Google ID
    Optional<OAuthUser> findByGoogleId(String googleId);
    
    // Find user by email
    Optional<OAuthUser> findByEmail(String email);
    
    // Find user by linked username (for existing user integration)
    Optional<OAuthUser> findByLinkedUsername(String linkedUsername);
    
    // Check if Google ID exists
    boolean existsByGoogleId(String googleId);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find active users by role
    @Query("SELECT u FROM OAuthUser u WHERE u.role = :role AND u.isActive = true")
    Optional<OAuthUser> findActiveUsersByRole(@Param("role") OAuthUser.UserRole role);
    
    // Get user with role and active status
    @Query("SELECT u FROM OAuthUser u WHERE u.googleId = :googleId AND u.isActive = true")
    Optional<OAuthUser> findActiveUserByGoogleId(@Param("googleId") String googleId);
}
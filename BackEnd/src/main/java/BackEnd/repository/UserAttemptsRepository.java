package BackEnd.repository;

import BackEnd.entity.UserAttempts;
import BackEnd.entity.UserAttemptsPKId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UserAttemptsRepository extends JpaRepository<UserAttempts, UserAttemptsPKId> {
    
    // FIXED: Use named parameters with @Param annotation
    @Query(value = "SELECT * FROM user_attempts WHERE user_name = :userName AND exam_id = :examId", 
           nativeQuery = true)
    Optional<UserAttempts> findUserAttemptsByUserNameAndExamId(
        @Param("userName") String userName, 
        @Param("examId") Long examId
    );
    
    // BETTER: Use JPA method naming convention (automatically safe)
    Optional<UserAttempts> findByUserNameAndExamId(String userName, Long examId);
    
    // DEPRECATED: Keep for backward compatibility but mark as deprecated
    @Deprecated
    @Query(value = "SELECT * FROM user_attempts WHERE user_name = :userName AND exam_id = :examId", 
           nativeQuery = true)
    UserAttempts findUserAttemptsByid(@Param("userName") String userName, @Param("examId") Long examId);
}

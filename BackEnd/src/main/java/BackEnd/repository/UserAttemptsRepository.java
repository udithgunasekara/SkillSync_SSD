package BackEnd.repository;

import BackEnd.entity.UserAttempts;
import BackEnd.entity.UserAttemptsPKId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserAttemptsRepository extends JpaRepository<UserAttempts, UserAttemptsPKId> {
    @Query(value = "SELECT * FROM skillsync_db.user_attempts WHERE user_name = ? AND exam_id = ?", nativeQuery = true)
    UserAttempts findUserAttemptsByid(String userName, Long examId);
}

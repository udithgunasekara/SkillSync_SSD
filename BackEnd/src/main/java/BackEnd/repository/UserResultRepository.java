package BackEnd.repository;

import BackEnd.entity.UserResult;
import BackEnd.entity.UserResultPKId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserResultRepository extends JpaRepository<UserResult, UserResultPKId> {

    // FIXED: Use named parameters instead of positional parameters to prevent SQL injection
    @Query(value = "SELECT * FROM skillsync_db.user_result WHERE user_name_pk = :userName AND exam_id_pk = :examId", nativeQuery = true)
    UserResult findUserResultByid(@Param("userName") String userName, @Param("examId") Long examId);

    @Query(value = "SELECT * FROM skillsync_db.user_result WHERE user_name_pk = :userName", nativeQuery = true)
    List<UserResult> findUserResultByusername(@Param("userName") String userName);
}

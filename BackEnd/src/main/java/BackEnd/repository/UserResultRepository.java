package BackEnd.repository;

import BackEnd.entity.UserResult;
import BackEnd.entity.UserResultPKId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserResultRepository extends JpaRepository<UserResult, UserResultPKId> {

    @Query(value = "SELECT * FROM skillsync_db.user_result WHERE user_name_pk = ? AND exam_id_pk = ?", nativeQuery = true)
    UserResult findUserResultByid(String userName, Long examId);

    @Query(value = "SELECT * FROM skillsync_db.user_result WHERE user_name_pk = ?", nativeQuery = true)
    List<UserResult> findUserResultByusername(String userName);
}

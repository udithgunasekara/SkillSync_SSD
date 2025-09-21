package BackEnd.repository;

import BackEnd.entity.Interview;
import BackEnd.entity.UserAttempts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    @Query(value = "SELECT * FROM skillsync_db.interview WHERE freelancer_fk = ?;", nativeQuery = true)
    Interview findUserInterviewByFreelancerName(Long userId);

}

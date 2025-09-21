package BackEnd.repository;

import BackEnd.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface JobRepository extends JpaRepository<Job,Integer>{

    @Query(value = "SELECT * FROM skillsync_db.job_listings WHERE"
            + " MATCH(job_title, description, required_skills)"
            + " AGAINST (?1)",
            nativeQuery = true)
    List<Job> searchJobs(String query);

}

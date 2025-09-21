package BackEnd.repository;

import BackEnd.entity.JobRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRequestRepository extends JpaRepository<JobRequest,Integer>{

}

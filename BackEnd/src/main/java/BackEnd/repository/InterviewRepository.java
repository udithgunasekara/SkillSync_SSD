package BackEnd.repository;

import BackEnd.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    // FIXED: Use named parameters and proper return type
    @Query(value = "SELECT * FROM interview WHERE freelancer_fk = :freelancerId", nativeQuery = true)
    Optional<Interview> findInterviewByFreelancerId(@Param("freelancerId") Long freelancerId);
    
    // BETTER: Use JPA method naming (automatically safe)
    Optional<Interview> findByFreelancerFk(Long freelancerId);
    
    // Additional safe methods
    List<Interview> findAllByFreelancerFk(Long freelancerId);
    
    // DEPRECATED: Keep for backward compatibility but mark as deprecated
    @Deprecated
    @Query(value = "SELECT * FROM interview WHERE freelancer_fk = :userId", nativeQuery = true)
    Interview findUserInterviewByFreelancerName(@Param("userId") Long userId);
}

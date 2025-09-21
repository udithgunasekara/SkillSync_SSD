package BackEnd.repository;



import BackEnd.entity.Freelancer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FreelancerVRepository extends JpaRepository<Freelancer,Long> {

    Optional<Freelancer> findByuserName(String userName);
}
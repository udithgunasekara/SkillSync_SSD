package BackEnd.repository;


import BackEnd.entity.FreelancerDescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FreelancerDescriptionRepository extends JpaRepository<FreelancerDescription,Long> {
    Optional <FreelancerDescription> findByusername(String username);
}
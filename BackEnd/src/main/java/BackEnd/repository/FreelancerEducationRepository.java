package BackEnd.repository;


import BackEnd.entity.FreelancerEducation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FreelancerEducationRepository extends JpaRepository<FreelancerEducation, Long> {

    void deleteById(Long id);

    List<FreelancerEducation> findByUsername(String username);

    Optional<FreelancerEducation> findByusername(String username);

    Optional<FreelancerEducation> findByusernameAndId(String username, Long id);
}
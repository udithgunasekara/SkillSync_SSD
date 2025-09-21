package BackEnd.repository;


import BackEnd.entity.FreelancerSkills;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FreelancerSkillsRepository extends JpaRepository<FreelancerSkills, Long> {

    List<FreelancerSkills> findByusername(String username);

    FreelancerSkills findByusernameAndSkill(String username, String skill);
}
package BackEnd.repository;


import BackEnd.entity.FreelancerLanguage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FreelancerLanguageRepository extends JpaRepository<FreelancerLanguage,Long> {

    List<FreelancerLanguage> findByusername(String username);

    void deleteByusername(String username);

    FreelancerLanguage findByusernameAndLanguage(String username, String language);
}
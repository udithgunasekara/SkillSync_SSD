package BackEnd.repository;


import BackEnd.entity.ClientLanguage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientLanguageRepository extends JpaRepository<ClientLanguage, Long> {


    void deleteByLanguage(String language);


    List<ClientLanguage> findByusername(String username);

    void deleteByusernameAndLanguage(String username, String language);

    ClientLanguage findByusernameAndLanguage(String username, String language);
}
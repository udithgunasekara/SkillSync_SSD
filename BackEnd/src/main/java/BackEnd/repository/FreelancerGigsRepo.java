package BackEnd.repository;

import BackEnd.entity.FreelancerGigs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FreelancerGigsRepo extends JpaRepository<FreelancerGigs, Long> {
    List<FreelancerGigs>  findByfreelancerUsername(String freelancerUsername);
    @Query("SELECT g FROM FreelancerGigs g WHERE g.freelancerUsername = :freelancerUsername AND lower(g.gigCategory) LIKE lower(concat('%', :keyword, '%'))")
    List<FreelancerGigs> findGigByFreelancerUsernameAndKeyword(@Param("freelancerUsername") String freelancerUsername, @Param("keyword") String keyword);
}

package BackEnd.repository;

import BackEnd.entity.Freelancer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FreelancerRepo extends JpaRepository<Freelancer, Long> {


//    @Query(value = "Select * from freelancer where user_name= :username", nativeQuery = true)
       Freelancer findByUserName(String username);

    @Query(value = "SELECT * FROM freelancer WHERE user_name = :username", nativeQuery = true)
    Optional<Freelancer> findByUsername(@Param("username") String username);


    @Query(value = "SELECT * FROM freelancer WHERE app_status = 'In Progress'", nativeQuery = true)
    List<Freelancer> findInProgressFreelancers();

    @Query(value = "SELECT app_status FROM freelancer WHERE user_name = :username", nativeQuery = true)
   String findAcceptedFreelancer(@Param("username") String username);

    @Query(value = "SELECT * FROM freelancer WHERE app_status = 'Accept'", nativeQuery = true)
    List<Freelancer> findAllAcceptedFreelancers();






}

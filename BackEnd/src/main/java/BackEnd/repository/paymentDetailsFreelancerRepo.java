package BackEnd.repository;

import BackEnd.entity.paymentDetailsFreelancer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface paymentDetailsFreelancerRepo extends JpaRepository<paymentDetailsFreelancer, String> {
    paymentDetailsFreelancer findByUserName(String userName);


    void deleteByUserName(String userName);
}

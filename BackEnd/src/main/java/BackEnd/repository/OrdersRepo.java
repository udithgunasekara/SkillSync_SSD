package BackEnd.repository;

import BackEnd.entity.FreelancerGigs;
import BackEnd.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrdersRepo extends JpaRepository<Orders, Long> {
    @Query("SELECT o FROM Orders o WHERE o.orderFreelancerUsername = :orderFreelancerUsername")
    List<Orders> findAllByOrderFreelancerUsername(String orderFreelancerUsername);
}

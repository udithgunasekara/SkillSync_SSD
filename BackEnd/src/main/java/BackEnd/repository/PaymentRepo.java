package BackEnd.repository;

import BackEnd.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaymentRepo extends JpaRepository<Payment, Long> {


    @Query (value = "select * from payment where transactionid = :transactionId or projectid = :projectId" , nativeQuery = true)
    List<Payment> findPaymentByTransactionID(Long transactionId, Long projectId);

    /*@Query (value = "select * from payment where projectid = :projectId", nativeQuery = true)
    List<Payment> findPaymentByProjectID(Long projectId); */


}

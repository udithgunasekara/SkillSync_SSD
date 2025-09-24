package BackEnd.repository;

import BackEnd.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaypalRepo extends JpaRepository<Payment, Long> {

    // FIXED: Add @Param annotations to prevent SQL injection
    @Query(value = "select * from payment where transactionid = :transactionId or projectid = :projectId", nativeQuery = true)
    List<Payment> findPaymentByTransactionID(@Param("transactionId") Long transactionId, @Param("projectId") Long projectId);
}

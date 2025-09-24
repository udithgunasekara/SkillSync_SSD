package BackEnd.repository;

import BackEnd.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepo extends JpaRepository<Ticket,Long> {
    // FIXED: Add @Param annotation to prevent SQL injection
    @Query(value = "select * from `tickets` where userid = :userid", nativeQuery = true)
    List<Ticket> findByuserId(@Param("userid") Long userid);
}

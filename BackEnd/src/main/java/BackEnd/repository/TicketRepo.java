package BackEnd.repository;

import BackEnd.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TicketRepo extends JpaRepository<Ticket,Long> {
    @Query(value = "select * from `tickets` where userid = :userid", nativeQuery = true)
    List<Ticket> findByuserId(Long userid);
}

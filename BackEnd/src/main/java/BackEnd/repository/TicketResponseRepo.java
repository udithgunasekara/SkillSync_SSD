package BackEnd.repository;

import BackEnd.entity.ticketResponses;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketResponseRepo extends JpaRepository<ticketResponses, Long> {

        Optional<List<ticketResponses>> findByTicketId(Long id);
}

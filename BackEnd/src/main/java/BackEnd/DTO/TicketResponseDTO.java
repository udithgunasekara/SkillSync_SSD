package BackEnd.DTO;

import BackEnd.entity.Ticket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class TicketResponseDTO {
    private Long id;
    private String Subject;
    private String response;
    private Ticket ticket;
    private LocalDateTime createdTime;
}

package BackEnd.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Ticket Responses",schema = "skillsync_db")
public class ticketResponses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String Subject;
    private String response;

    @ManyToOne
    @JoinColumn(name = "ticket_id")
    @JsonIgnore
    private Ticket ticket;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdTime;
}

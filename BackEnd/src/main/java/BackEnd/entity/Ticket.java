package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Tickets", schema = "skillsync_db")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;

//    @Lob
//    @Column(columnDefinition = "LONGBLOB")
//    private byte[] attachments;

    private String relatedTo;
    private String Subject;
    @Column(columnDefinition = "MEDIUMTEXT")
    private String Description;

    @ManyToOne
    @JoinColumn(name = "userid")
    private UserCredential user;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ticketResponses> responses = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdTime;
    @UpdateTimestamp
    private LocalDateTime updatedTime;
    private String status;

}

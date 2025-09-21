package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity

public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(name = "order_date_time")
    private LocalDateTime orderDateTime;

    @Column(name = "packageName")
    private String packageName;

    @Column(name = "cus_remarks")
    private String cusRemarks;

    @Column(name = "cus_name")
    private String cusName;

    @Column(name = "order_status")
    private String orderStatus = "Pending";

    @Column(name = "order_gig_id")
    private String orderGigId;

    @Column(name = "order_freelancer_username")
    private String orderFreelancerUsername;

    @PrePersist
    public void prePersist() {
        orderDateTime = LocalDateTime.now();
    }

}

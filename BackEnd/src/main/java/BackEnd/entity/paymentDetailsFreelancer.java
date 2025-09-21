package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "PaymentDetailsFreelancer", schema = "skillsync_db")
public class paymentDetailsFreelancer {
    @Id
    //@GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    private String userName;
    private String fullName;
    private String country;
    private String state;
    private String address;
    private String city;
    private Integer postalCode;
    @Column(name = "paypal_address", unique = true)
    private String paypalAddress;



}

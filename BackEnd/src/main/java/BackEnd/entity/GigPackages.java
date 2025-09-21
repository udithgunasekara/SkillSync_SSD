package BackEnd.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "gig_packages")
public class GigPackages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Long packageId;

    @Column(name = "package_name")
    private String packageName;

    @Column(name = "package_description")
    private String packageDescription;

    @Column(name = "package_price")
    private String packagePrice;

    @Column(name = "package_delivery_time")
    private String packageDeliveryTime;

    @ManyToOne
    @JoinColumn(name = "gig_id")
    private FreelancerGigs gigId;

}

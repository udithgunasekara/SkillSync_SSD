package BackEnd.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class paymentDetailsFreelancerDTO {
    private Long id;
    private String userName;
    private String fullName;
    private String country;
    private String state;
    private String address;
    private String city;
    private Integer postalCode;
    private String paypalAddress;




}

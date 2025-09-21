package BackEnd.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class OrdersDTO {
    private Long orderId;
    private LocalDateTime orderDateTime;
    private String packageName;
    private String orderStatus;
    private String cusRemarks;
    private String cusName;
    private String orderGigId;
    private String orderFreelancerUsername;
}

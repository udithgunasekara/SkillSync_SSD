package BackEnd.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    private Long transactionID;
    private LocalDate date;
    private String paymentMethod;
    private Long projectID;
    private Double amount;
}

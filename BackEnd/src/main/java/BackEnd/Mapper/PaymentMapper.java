package BackEnd.Mapper;

import BackEnd.DTO.PaymentDTO;
import BackEnd.entity.Payment;

public class PaymentMapper {

    public static PaymentDTO mapToPaymentDTO(Payment payment) {
        if (payment == null) {
            return null;
        }
        return new PaymentDTO(
                payment.getTransactionID(),
                payment.getDate(),
                payment.getPaymentMethod(),
                payment.getProjectID(),
                payment.getAmount()
        );
    }

    public static Payment mapToPayment(PaymentDTO paymentDTO) {
        if (paymentDTO == null) {
            return null;
        }
        return new Payment(
                paymentDTO.getTransactionID(),
                paymentDTO.getDate(),
                paymentDTO.getPaymentMethod(),
                paymentDTO.getProjectID(),
                paymentDTO.getAmount()
        );
    }
}

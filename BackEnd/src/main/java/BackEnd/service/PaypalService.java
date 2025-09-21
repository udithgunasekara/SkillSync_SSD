package BackEnd.service;


import BackEnd.DTO.PaymentDTO;

import java.util.List;

public interface PaypalService {

    PaymentDTO createPayment(PaymentDTO paymentDTO);

    PaymentDTO getPaymentById(Long transactionId);

    List<PaymentDTO> getAllPayment();

    List<PaymentDTO> findPaymentByTransactionID(Long transactionId, Long projectId);


}

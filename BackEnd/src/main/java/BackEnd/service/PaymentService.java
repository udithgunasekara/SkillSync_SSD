package BackEnd.service;

import BackEnd.DTO.PaymentDTO;

import java.io.File;
import java.io.IOException;
import java.util.List;

public interface PaymentService {

    PaymentDTO createPayment(PaymentDTO paymentDTO);

    PaymentDTO getPaymentById(Long transactionId);

    List<PaymentDTO> getAllPayment();

    List<PaymentDTO> findPaymentByTransactionID(Long transactionId, Long projectId);

    File generateReceipt(Long transactionId) throws IOException;

}

package BackEnd.service.imple;


import BackEnd.DTO.PaymentDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.PaymentMapper;
import BackEnd.entity.Payment;
import BackEnd.repository.PaymentRepo;
import BackEnd.repository.PaypalRepo;
import BackEnd.service.PaypalService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class PaypalServiceImpl implements PaypalService {

    private PaypalRepo paypalRepo;

    @Autowired
    public PaypalServiceImpl(PaypalRepo paypalRepo) {
        this.paypalRepo = paypalRepo;
    }

    @Override
    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        Payment payment = PaymentMapper.mapToPayment(paymentDTO);
        Payment savedPayment = paypalRepo.save(payment);

        return PaymentMapper.mapToPaymentDTO(savedPayment);
    }

    @Override
    public PaymentDTO getPaymentById(Long transactionId) {
        Payment payment = paypalRepo.findById(transactionId)
                .orElseThrow(() ->
                        new ResourceNotFound("Payment is not exists with given id : " + transactionId));
        return PaymentMapper.mapToPaymentDTO(payment);
    }

    @Override
    public List<PaymentDTO> getAllPayment() {
        List<Payment> payments = paypalRepo.findAll();
        return payments.stream().map((payment) -> PaymentMapper.mapToPaymentDTO(payment))
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> findPaymentByTransactionID(Long transactionId, Long projectId) {
        List<Payment> payments = paypalRepo.findPaymentByTransactionID(transactionId, projectId);
        return payments.stream()
                .map(payment -> PaymentMapper.mapToPaymentDTO(payment))
                .collect(Collectors.toList());
    }
}




package BackEnd.service.imple;

import BackEnd.DTO.PaymentDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.PaymentMapper;
import BackEnd.entity.Payment;
import BackEnd.repository.PaymentRepo;
import BackEnd.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class PaymentServiceImpl implements PaymentService {

    private PaymentRepo PaymentRepo;

    @Autowired
    public PaymentServiceImpl(PaymentRepo PaymentRepo) {
        this.PaymentRepo = PaymentRepo;
    }

    @Override
    public PaymentDTO createPayment(PaymentDTO paymentDTO){

        Payment payment = PaymentMapper.mapToPayment(paymentDTO);
        Payment savedPayment = PaymentRepo.save(payment);

        return PaymentMapper.mapToPaymentDTO(savedPayment);
    }

    @Override
    public PaymentDTO getPaymentById(Long transactionId) {
        Payment payment = PaymentRepo.findById(transactionId)
                .orElseThrow(() ->
                        new ResourceNotFound("Payment is not exists with given id : " + transactionId));
        return PaymentMapper.mapToPaymentDTO(payment);
    }

    @Override
    public List<PaymentDTO> getAllPayment(){
        List<Payment> payments = PaymentRepo.findAll();
        return payments.stream().map((payment) -> PaymentMapper.mapToPaymentDTO(payment))
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentDTO> findPaymentByTransactionID(Long transactionId, Long projectId) {
        List<Payment> payments = PaymentRepo.findPaymentByTransactionID(transactionId, projectId);
        return payments.stream()
                .map(payment -> PaymentMapper.mapToPaymentDTO(payment))
                .collect(Collectors.toList());
    }

    @Override
    public File generateReceipt(Long transactionId) throws IOException {
        // Retrieve the payment record from the database using the transaction ID
        Payment payment = PaymentRepo.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFound("Payment not found with given ID: " + transactionId));

        // Create a new file for the receipt
        File receiptFile = File.createTempFile("receipt_" + transactionId, ".txt");

        // Use a FileWriter to write the receipt details to the file
        try (FileWriter writer = new FileWriter(receiptFile)) {
            writer.write("Payment Receipt\n");
            writer.write("Transaction ID: " + payment.getTransactionID() + "\n");
            writer.write("Date: " + payment.getDate() + "\n");
            writer.write("Payment Method: " + payment.getPaymentMethod() + "\n");
            writer.write("Project ID: " + payment.getProjectID() + "\n");
            writer.write("Amount: $" + payment.getAmount() + "\n");
        }

        // Return the receipt file
        return receiptFile;
    }




}

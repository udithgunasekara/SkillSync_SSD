package BackEnd.controller;


import BackEnd.DTO.PaymentDTO;
import BackEnd.service.PaypalService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping(path ="/payments")
public class PaypalController {

    private PaypalService paypalService;

    @PostMapping("/create")
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody PaymentDTO paymentDTO){
        PaymentDTO savedPayment = paypalService.createPayment(paymentDTO);
        return new ResponseEntity<>(savedPayment, HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable("id") Long transactionId){
        PaymentDTO paymentDTO = paypalService.getPaymentById(transactionId);
        return ResponseEntity.ok(paymentDTO);
    }

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayment(){
        List<PaymentDTO> payments = paypalService.getAllPayment();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/search")
    public ResponseEntity<List<PaymentDTO>> searchPayments(@RequestParam(required = false) Long transactionId,
                                                           @RequestParam(required = false) Long projectId) {
        List<PaymentDTO> payments = paypalService.findPaymentByTransactionID(transactionId, projectId);
        return ResponseEntity.ok(payments);
    }
}





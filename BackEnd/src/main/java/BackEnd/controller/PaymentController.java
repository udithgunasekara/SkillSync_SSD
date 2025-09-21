package BackEnd.controller;

import BackEnd.DTO.PaymentDTO;
import BackEnd.service.PaymentService;
import lombok.AllArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;


import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


@CrossOrigin(origins = "http://localhost:3000")
@AllArgsConstructor
@RestController
@RequestMapping(path ="/payment")
public class PaymentController {

    private PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody PaymentDTO paymentDTO){
        PaymentDTO savedPayment = paymentService.createPayment(paymentDTO);
        return new ResponseEntity<>(savedPayment, HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable("id") Long transactionId){
        PaymentDTO paymentDTO = paymentService.getPaymentById(transactionId);
        return ResponseEntity.ok(paymentDTO);
    }

    //history
    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getAllPayment(){
        List<PaymentDTO> payments = paymentService.getAllPayment();
        return ResponseEntity.ok(payments);
    }

    //search
    @GetMapping("/search")
    public ResponseEntity<List<PaymentDTO>> searchPayments(@RequestParam(required = false) Long transactionId,
                                                           @RequestParam(required = false) Long projectId) {
        List<PaymentDTO> payments = paymentService.findPaymentByTransactionID(transactionId, projectId);
        return ResponseEntity.ok(payments);
    }


    //generate payment receipt
    @GetMapping("/receipt/{transactionId}")
    public ResponseEntity<InputStreamResource> downloadReceipt(@PathVariable Long transactionId) {
        try {
            // Generate the receipt file
            File receiptFile = paymentService.generateReceipt(transactionId);

            // Create InputStreamResource from the file
            InputStreamResource resource = new InputStreamResource(new FileInputStream(receiptFile));

            // Create headers for file download
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=" + receiptFile.getName());
            headers.add("Content-Type", MediaType.TEXT_PLAIN_VALUE);

            // Return the file as a response entity
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(resource);
        } catch (IOException e) {
            // Handle the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}

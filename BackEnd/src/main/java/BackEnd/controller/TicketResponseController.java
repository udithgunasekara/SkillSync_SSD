package BackEnd.controller;

import BackEnd.DTO.TicketResponseDTO;
import BackEnd.service.imple.TicketResposnseServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/ticketresponse")
public class TicketResponseController {
    public TicketResposnseServiceImpl ticketResponseServices;

    //url : http://localhost:8082/ticketresponse/allticketresponse
    @GetMapping("/allticketresponse")
    public ResponseEntity<List<TicketResponseDTO>> getAllTicketResponse(){
        List<TicketResponseDTO> ticketresponselist = ticketResponseServices.getAllTicketResponse();
        return ResponseEntity.ok(ticketresponselist);
    }

    //url: http://localhost:8082/ticketresponse/addticketresponse
    @PostMapping("/addticketresponse")
    public ResponseEntity<TicketResponseDTO> addTicketResponse(@RequestBody TicketResponseDTO ticketresponsedto){
        TicketResponseDTO newTicketResponse = ticketResponseServices.addTicketResponse(ticketresponsedto);
        return new ResponseEntity<>(newTicketResponse, HttpStatus.CREATED);
    }

    //url: http://localhost:8082/ticketresponse/findresponse?id=1
    @GetMapping("/findresponse")
    public ResponseEntity<TicketResponseDTO> findTicketResponseByID(@RequestParam Long id){
        TicketResponseDTO ticketresponse = ticketResponseServices.findTicketResponseByID(id);
        return ResponseEntity.ok(ticketresponse);
    }

    //url: http://localhost:8082/ticketresponse/updateresponse?id=1
    @PutMapping("/updateresponse")
    public ResponseEntity<TicketResponseDTO> updateTicketResponseByID(@RequestBody TicketResponseDTO updateinfo, @RequestParam Long id){
        TicketResponseDTO updatedticketresponse = ticketResponseServices.updateTicketResponseByID(updateinfo, id);
        return new ResponseEntity<>(updatedticketresponse, HttpStatus.OK);
    }

    //url : http://localhost:8082/ticketresponse/deleteresponse?id=1
    @DeleteMapping("/deleteresponse")
    public ResponseEntity<String> deleteTicketResponseById(@RequestParam Long id){
        String delete = ticketResponseServices.deleteTicketResponseById(id);
        return ResponseEntity.ok(delete);
    }

    //url: http://localhost:8082/ticketresponse/findresponsebytid?id=1
    @GetMapping("/findresponsebytid")
    public ResponseEntity<List<TicketResponseDTO>> getResponseByTicketId(@RequestParam Long id){
        List<TicketResponseDTO> ticketresponse = ticketResponseServices.getResponseByTicketId(id);
        return ResponseEntity.ok(ticketresponse);
    }
}

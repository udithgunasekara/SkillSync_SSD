package BackEnd.controller;

import BackEnd.DTO.TicketDto;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.service.TicketServices;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/ticket")
public class TicketController {
    public TicketServices ticketServices;

    //url : http://localhost:8082/ticket/alltickets/12323
    @GetMapping("/alltickets/{userid}")
    public ResponseEntity<List<TicketDto>> getAllTicketsByuserid(@PathVariable Long userid){
        System.out.println("userid: "+userid);
        List<TicketDto> ticketlist = ticketServices.getAllTicketsById(userid);
        return ResponseEntity.ok(ticketlist);
    }

    //url: http://localhost:8082/ticket/addticket
    @PostMapping("/addticket")
    public ResponseEntity<TicketDto> raiseTicket(@RequestBody TicketDto ticketdto){
        TicketDto newTicket = ticketServices.raiseTicket(ticketdto);
        return new ResponseEntity<>(newTicket, HttpStatus.CREATED);
    }





    //url: http://localhost:8082/ticket/findticket/1
    @GetMapping("/findticket/{id}")
    public ResponseEntity<TicketDto> findTicketByID(@PathVariable Long id,Long userid ){
        TicketDto ticket = ticketServices.getTicketByTicketID(id, userid);
        return ResponseEntity.ok(ticket);
    }

    @PutMapping("/updateticket/{id}")
    public ResponseEntity<TicketDto> updateTicketByID(@RequestBody TicketDto updateinfo, @PathVariable Long id, Long usrid){
        TicketDto updatedticket = ticketServices.updateTicketByID(updateinfo, id, usrid);
        return new ResponseEntity<>(updatedticket, HttpStatus.OK);
    }
    //url: http://localhost:8082/ticket/deleteticket?id=1&userid=1
    @DeleteMapping("/deleteticket")
    public ResponseEntity<String> deleteTicketById(@RequestParam Long id, @RequestParam Long userid){
        try {
            String delete = ticketServices.deleteTicketById(id, userid);
            return ResponseEntity.ok(delete);
        }catch (ResourceNotFound e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    //url: http://localhost:8082/ticket/getticket
    @GetMapping("/getticket")
    public ResponseEntity<List<TicketDto>> getAllTickets(){
        List<TicketDto> ticketlist = ticketServices.getAllTickets();
        return ResponseEntity.ok(ticketlist);
    }

    //url: http://localhost:8082/ticket/changeticketstatus?ticketId=1&status=resolved
    @PutMapping("/changeticketstatus")
    public ResponseEntity<String> changeTicketStatus(@RequestParam Long ticketId, @RequestParam String status){
        String updated = ticketServices.changeTicketStatus(ticketId, status);
        return ResponseEntity.ok(updated);
    }

    //url: http://localhost:8082/ticket/findticketbyid?id=1
    @GetMapping("/findticketbyid")
    public ResponseEntity<TicketDto> getTicketByTicketID(@RequestParam Long id){
        TicketDto ticket = ticketServices.getTicketByTicketID(id);
        return ResponseEntity.ok(ticket);
    }
}

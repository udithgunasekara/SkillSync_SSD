package BackEnd.service.imple;

import BackEnd.DTO.TicketDto;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.entity.Ticket;
import BackEnd.repository.TicketRepo;
import BackEnd.service.TicketServices;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class TicketServicesImpl implements TicketServices {

    private TicketRepo ticketRepo;
    private ModelMapper modelMapper;

    @Override
    public List<TicketDto> getAllTicketsById(Long userid) {
        List<Ticket> ticketList = ticketRepo.findByuserId(userid);
        List<TicketDto> ticketDtoList = new ArrayList<>();
        ticketList.forEach(
                (p) -> {
                    ticketDtoList.add(modelMapper.map(p, TicketDto.class));
                }
        );
        return ticketDtoList;
    }

    @Override
    public TicketDto raiseTicket(TicketDto ticketDto) {
        Ticket ticket = modelMapper.map(ticketDto, Ticket.class);
        Ticket newTicket = ticketRepo.save(ticket);
        return modelMapper.map(newTicket, TicketDto.class);
    }

    @Override
    public TicketDto getTicketByTicketID(Long id, Long userid) {
        Ticket ticket = ticketRepo.findById(id).orElseThrow(
                () -> new ResourceNotFound("No ticket found...")
        );
        if(ticket.getUser().getUserId()==userid){
            return modelMapper.map(ticket, TicketDto.class);
        }else{
            throw new ResourceNotFound("you have no permission to view this ticket");
        }

    }

    @Override
    public TicketDto updateTicketByID(TicketDto updateinfo, Long id, Long userid) {
        Ticket ticket = ticketRepo.findById(id).orElseThrow(
                () -> new ResourceNotFound("No ticket found..failed to update")
        );
        if(ticket.getUser().getUserId()==userid){
            ticket.setRelatedTo(updateinfo.getRelatedTo());
            ticket.setSubject(updateinfo.getSubject());
            ticket.setDescription(updateinfo.getDescription());
            ticket.setStatus(updateinfo.getStatus());
            ticket.setEmail(updateinfo.getEmail());
            Ticket updatedTicket = ticketRepo.save(ticket);
            return modelMapper.map(updatedTicket, TicketDto.class);
        }else{
            throw new ResourceNotFound("you have no permission to update this ticket");
        }
    }

    @Override
    public String deleteTicketById(Long id, Long userid) {
        Ticket targetTicket = ticketRepo.findById(id).orElseThrow(
                () -> new ResourceNotFound("No ticket found")
        );
        if(targetTicket.getUser().getUserId()==userid){
//            targetTicket.getResponses().forEach(
//                    (p) -> {
//                        p.setTicket(null);
//                    }
//            );
            ticketRepo.delete(targetTicket);
            return "Ticket deleted successfully";
        }else{
            throw new ResourceNotFound("You have no permission to delete this ticket");
        }

    }

    @Override
    public List<TicketDto> getAllTickets() {
        List<Ticket> ticketList = ticketRepo.findAll();
        System.out.println("ticketlist size: " + ticketList.size());
        List<TicketDto> ticketDtoList = new ArrayList<>();
        ticketList.forEach(
                (p) -> {
                    ticketDtoList.add(modelMapper.map(p, TicketDto.class));
                }
        );
        return ticketDtoList;
    }

    @Override
    public String changeTicketStatus(Long ticketId, String status) {
        Ticket targetTicket = ticketRepo.findById(ticketId).orElseThrow(
                () -> new ResourceNotFound("No ticket found")
        );
        if(targetTicket.getStatus().equals(status)){
            return "Status already set to "+status;
        }else{
            targetTicket.setStatus(status);
            Ticket updatedTicket = ticketRepo.save(targetTicket);
            if (updatedTicket.getStatus().equals(status)){
                return "status updated successfully";
            }else{
                return "somethong went wrong..failed to update status";
            }
        }
    }

    @Override
    public TicketDto getTicketByTicketID(Long id) {
        Ticket ticket = ticketRepo.findById(id).orElseThrow(
                () -> new ResourceNotFound("No ticket found...")
        );
        return modelMapper.map(ticket, TicketDto.class);
    }
}

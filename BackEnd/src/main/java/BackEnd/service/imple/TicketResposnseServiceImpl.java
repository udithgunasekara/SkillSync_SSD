package BackEnd.service.imple;

import BackEnd.DTO.TicketResponseDTO;
import BackEnd.entity.ticketResponses;
import BackEnd.repository.TicketResponseRepo;
import BackEnd.service.TicketResponseService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class TicketResposnseServiceImpl implements TicketResponseService {

    private TicketResponseRepo responserepo;
    private ModelMapper modelMapper;

    @Override
    public List<TicketResponseDTO> getAllTicketResponse() {
        List<ticketResponses> ticketResponses = responserepo.findAll();

        List<TicketResponseDTO> ticketResponseDTOList = new ArrayList<>();
        ticketResponses.forEach(
                (p) -> {ticketResponseDTOList.add(modelMapper.map(p, TicketResponseDTO.class));}
        );

        return ticketResponseDTOList;    }

    @Override
    public TicketResponseDTO addTicketResponse(TicketResponseDTO ticketResponseDTO) {

        ticketResponses addResponse = modelMapper.map(ticketResponseDTO, ticketResponses.class);

        ticketResponses response = responserepo.save(addResponse);

        TicketResponseDTO ticketResponseDTO1 = modelMapper.map(response, TicketResponseDTO.class);

        return ticketResponseDTO1;
    }

    @Override
    public TicketResponseDTO findTicketResponseByID(Long id) {

        ticketResponses response = responserepo.findById(id).orElseThrow(
                () -> new RuntimeException("No response found")
        );

        return modelMapper.map(response, TicketResponseDTO.class);
    }

    @Override
    public TicketResponseDTO updateTicketResponseByID(TicketResponseDTO updateinfo, Long id) {

        ticketResponses response = responserepo.findById(id).orElseThrow(
                () -> new RuntimeException("No response found")
        );

        response.setResponse(updateinfo.getResponse());
        response.setSubject(updateinfo.getSubject());


        ticketResponses updatedResponse = responserepo.save(response);

        return modelMapper.map(updatedResponse, TicketResponseDTO.class);
    }

    @Override
    public String deleteTicketResponseById(Long id) {

        ticketResponses targetResponse = responserepo.findById(id).orElseThrow(
                () -> new RuntimeException("No response found")
        );

        if (responserepo.findById(id).isPresent()){
            responserepo.delete(targetResponse);
            return "Response deleted successfully";
        }else{
            return "No response found";
        }

    }

    @Override
    public List<TicketResponseDTO> getResponseByTicketId(Long id) {
        List<ticketResponses> response = responserepo.findByTicketId(id).orElseThrow(
                () -> new RuntimeException("No response found")
        );
        List<TicketResponseDTO> ticketResponseDTOList = new ArrayList<>();
        response.forEach(
                (p) -> {ticketResponseDTOList.add(modelMapper.map(p, TicketResponseDTO.class));});
        return ticketResponseDTOList;
    }
}

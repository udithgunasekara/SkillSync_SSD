package BackEnd.service;

import BackEnd.DTO.TicketResponseDTO;

import java.util.List;

public interface TicketResponseService {
    List<TicketResponseDTO> getAllTicketResponse();

    TicketResponseDTO addTicketResponse(TicketResponseDTO ticketResponseDTO);

    TicketResponseDTO findTicketResponseByID(Long id);

    TicketResponseDTO updateTicketResponseByID(TicketResponseDTO updateinfo, Long id);

    String deleteTicketResponseById(Long id);

    List<TicketResponseDTO> getResponseByTicketId(Long id);
}

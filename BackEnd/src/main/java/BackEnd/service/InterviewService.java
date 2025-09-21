package BackEnd.service;

import BackEnd.DTO.InterviewDTO;

import java.util.List;

public interface InterviewService {

    InterviewDTO saveReservation(Long freelancerId, InterviewDTO interviewDTO);

    InterviewDTO getReservationByUserName(Long userId);

    List<InterviewDTO> getAllReservations();
}

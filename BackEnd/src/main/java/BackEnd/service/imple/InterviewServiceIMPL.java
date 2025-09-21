package BackEnd.service.imple;

import BackEnd.DTO.InterviewDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.InterviewMapper;
import BackEnd.entity.Interview;
import BackEnd.repository.InterviewRepository;
import BackEnd.service.InterviewService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class InterviewServiceIMPL implements InterviewService {

    InterviewRepository interviewRepository;
    @Override
    public InterviewDTO saveReservation(Long freelancerId, InterviewDTO interviewDTO) {
        Interview interview = InterviewMapper.mapToInterview(interviewDTO);
        interview.setFreelancerFk(freelancerId);
        Interview saveInterview = interviewRepository.save(interview);
        return InterviewMapper.mapToInterviewDTO(saveInterview);
    }

    @Override
    public InterviewDTO getReservationByUserName(Long userId) {
        Interview interview = interviewRepository.findUserInterviewByFreelancerName(userId);
        if(interview == null){
            throw new ResourceNotFound("Result not found for user: " + userId);
        }
        return InterviewMapper.mapToInterviewDTO(interview);
    }

    @Override
    public List<InterviewDTO> getAllReservations() {
        List<Interview> allInterview = interviewRepository.findAll();
        return allInterview.stream().map((interview) -> InterviewMapper.mapToInterviewDTO(interview)).collect(Collectors.toList());
    }
}

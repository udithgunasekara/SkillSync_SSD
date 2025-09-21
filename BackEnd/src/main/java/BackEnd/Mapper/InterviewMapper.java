package BackEnd.Mapper;

import BackEnd.DTO.InterviewDTO;
import BackEnd.entity.Interview;

public class InterviewMapper {

    public static InterviewDTO mapToInterviewDTO(Interview interview){
        return new InterviewDTO(
                interview.getInterviewId(),
                interview.getCategory(),
                interview.getDate(),
                interview.getTime(),
                interview.getMeetingLink(),
                interview.getFreelancerFk()
        );
    }

    public static Interview mapToInterview(InterviewDTO interviewDTO){
        return new Interview(
                interviewDTO.getInterviewId(),
                interviewDTO.getCategory(),
                interviewDTO.getDate(),
                interviewDTO.getTime(),
                interviewDTO.getMeetingLink(),
                interviewDTO.getFreelancerFk()
        );
    }
}

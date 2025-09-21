package BackEnd.Mapper;

import BackEnd.DTO.JobRequestDto;
import BackEnd.entity.JobRequest;

public class JobRequestMapper {

    public static JobRequestDto mapToJobRequestDto(JobRequest jobRequest){
        return new JobRequestDto(
                jobRequest.getRequestid(),
                jobRequest.getFreelancername(),
                jobRequest.getMessage(),
                jobRequest.getStatus()
        );
    }

    public static JobRequest mapToJobRequest(JobRequestDto jobRequestDto) {
        return new JobRequest(
                jobRequestDto.getRequestid(),
                jobRequestDto.getFreelancername(),
                jobRequestDto.getMessage(),
                jobRequestDto.getStatus()
        );
    }
}

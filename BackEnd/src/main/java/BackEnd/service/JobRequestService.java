package BackEnd.service;

import BackEnd.DTO.JobRequestDto;
import java.util.List;

public interface JobRequestService {

    JobRequestDto applyJob(JobRequestDto jobRequestDto);

    JobRequestDto getJobRequestById(int requestid);

    List<JobRequestDto> getAllJobRequests();

    JobRequestDto updateJobRequest(int requestid, JobRequestDto updatedJobRequest);

    void deleteJobRequest(int requestid);
}

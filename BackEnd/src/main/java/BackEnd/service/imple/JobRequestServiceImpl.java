package BackEnd.service.imple;

import BackEnd.service.JobRequestService;
import lombok.AllArgsConstructor;
import BackEnd.DTO.JobRequestDto;
import BackEnd.entity.JobRequest;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.JobRequestMapper;
import BackEnd.repository.JobRequestRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor

public class JobRequestServiceImpl implements JobRequestService {

    private JobRequestRepository jobRequestRepository;

    @Override

    public JobRequestDto applyJob(JobRequestDto jobRequestDto) {

        JobRequest jobRequest = JobRequestMapper.mapToJobRequest(jobRequestDto);
        JobRequest savedJobRequesting = jobRequestRepository.save(jobRequest);
        return  JobRequestMapper.mapToJobRequestDto(savedJobRequesting);
    }

    @Override
    public JobRequestDto getJobRequestById(int requestid) {
        JobRequest jobRequest = jobRequestRepository.findById(requestid)
                .orElseThrow(() ->
                        new ResourceNotFound("JobRequest is not exist"));
        return JobRequestMapper.mapToJobRequestDto(jobRequest);
    }

    @Override
    public List<JobRequestDto> getAllJobRequests() {
        List<JobRequest>jobRequests = jobRequestRepository.findAll();
        return jobRequests.stream()
                .map(JobRequestMapper::mapToJobRequestDto)
                .collect(Collectors.toList());
    }

    @Override
    public JobRequestDto updateJobRequest(int requestid, JobRequestDto updatedJobRequest) {

        JobRequest jobRequest = jobRequestRepository.findById(requestid).orElseThrow(
                () -> new ResourceNotFound("JobRequest is not exist"));

        jobRequest.setFreelancername(updatedJobRequest.getFreelancername());
        jobRequest.setMessage(updatedJobRequest.getMessage());
        jobRequest.setStatus(updatedJobRequest.getStatus());

        JobRequest updatedJobRequestObj = jobRequestRepository.save(jobRequest);
        return JobRequestMapper.mapToJobRequestDto(updatedJobRequestObj);
    }

    @Override
    public void deleteJobRequest(int requestid) {

        JobRequest jobRequest = jobRequestRepository.findById(requestid).orElseThrow(
                () -> new ResourceNotFound("JobRequest is not exist"));

        jobRequestRepository.deleteById(requestid);
    }


}

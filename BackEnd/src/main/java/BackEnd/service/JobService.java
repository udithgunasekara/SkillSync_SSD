package BackEnd.service;

import BackEnd.DTO.JobDto;
import java.util.List;

public interface JobService {

    JobDto createJobListing(JobDto jobDto);

    JobDto getJobPostingById(int id);

    List<JobDto> getAllJobListings();

    JobDto updateJobPosting(int id, JobDto updatedJobPosting);

    void deleteJobPosting(int id);

    List<JobDto> searchJobs(String query);

}

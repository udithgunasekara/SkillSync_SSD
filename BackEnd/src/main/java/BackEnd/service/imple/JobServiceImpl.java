package BackEnd.service.imple;

import lombok.AllArgsConstructor;
import BackEnd.DTO.JobDto;
import BackEnd.entity.Job;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.JobMapper;
import BackEnd.repository.JobRepository;
import BackEnd.service.JobService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service//to create the spring bean for JobServiceImpl class
@AllArgsConstructor

public class JobServiceImpl implements JobService{

    private JobRepository jobRepository; //inject Job Repository as a dependency

    @Override
    //Implementation of create jobListing method
    public JobDto createJobListing(JobDto jobDto) {

        //need to convert JobDto into Job JP Entity(Store the Job entity into database)

        //convert JobDto into Job Entity
        Job job = JobMapper.mapToJob(jobDto);
        //save Job Entity into database
        Job savedJobListing = jobRepository.save(job);
        return  JobMapper.mapToJobDto(savedJobListing);
    }

    @Override
    public JobDto getJobPostingById(int id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFound("JobPosting is not exist"));
        return JobMapper.mapToJobDto(job);
    }

    @Override
    public List<JobDto> getAllJobListings() {
        List<Job>jobs = jobRepository.findAll();
        return jobs.stream()
                .map(JobMapper::mapToJobDto)
                .collect(Collectors.toList());
    }

    @Override
    public JobDto updateJobPosting(int id, JobDto updatedJobPosting) {

        Job job = jobRepository.findById(id).orElseThrow(
                () -> new ResourceNotFound("JobPosting is not exist"));

        //set all the details from updatedJobPosting(object) into job object
        job.setJobTitle(updatedJobPosting.getJobTitle());
        job.setSkills(updatedJobPosting.getSkills());
        job.setScope(updatedJobPosting.getScope());
        job.setBudget(updatedJobPosting.getBudget());
        job.setDescription(updatedJobPosting.getDescription());

        Job updatedJobPostingObj = jobRepository.save(job);
        return JobMapper.mapToJobDto(updatedJobPostingObj);
    }

    @Override
    public void deleteJobPosting(int id) {

        Job job = jobRepository.findById(id).orElseThrow(
                () -> new ResourceNotFound("JobPosting is not exist"));

        jobRepository.deleteById(id);
    }

    @Override
    public List<JobDto> searchJobs(String query) {
        List<Job> jobs = jobRepository.searchJobs(query);
        return jobs.stream()
                .map(JobMapper::mapToJobDto)
                .collect(Collectors.toList());
    }

}

package BackEnd.Mapper;

import BackEnd.DTO.JobDto;
import BackEnd.entity.Job;

public class JobMapper {

    public static JobDto mapToJobDto(Job job){
        return new JobDto(
                job.getId(),
                job.getJobTitle(),
                job.getSkills(),
                job.getScope(),
                job.getBudget(),
                job.getDescription(),
                job.getPostedTime(),
                job.getCustomerUsername()
        );
    }

    public static Job mapToJob(JobDto jobDto) {
        return new Job(
                jobDto.getId(),
                jobDto.getJobTitle(),
                jobDto.getSkills(),
                jobDto.getScope(),
                jobDto.getBudget(),
                jobDto.getDescription(),
                jobDto.getPostedTime(),
                jobDto.getCustomerUsername()
        );
    }

}

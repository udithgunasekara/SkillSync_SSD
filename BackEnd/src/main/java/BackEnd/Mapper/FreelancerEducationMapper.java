package BackEnd.Mapper;

import BackEnd.DTO.FreelancerEducationDTO;
import BackEnd.entity.FreelancerEducation;

public class FreelancerEducationMapper {
    public static FreelancerEducationDTO mapToFreelancerEducationDTO(FreelancerEducation freelancerEducation){
        return new FreelancerEducationDTO(
                freelancerEducation.getId(),
                freelancerEducation.getUsername(),
                freelancerEducation.getInstitute(),
                freelancerEducation.getTitle(),
                freelancerEducation.getMajor(),
                freelancerEducation.getYear()
        );
    }

    public static FreelancerEducation mapToFreelancerEducation(FreelancerEducationDTO freelancerEducationDTO){
        return new FreelancerEducation(
                freelancerEducationDTO.getId(),
                freelancerEducationDTO.getUsername(),
                freelancerEducationDTO.getInstitute(),
                freelancerEducationDTO.getTitle(),
                freelancerEducationDTO.getMajor(),
                freelancerEducationDTO.getYear()
        );
    }
}
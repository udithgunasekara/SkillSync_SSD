package BackEnd.Mapper;

import BackEnd.DTO.FreelancerDescriptionDTO;
import BackEnd.entity.FreelancerDescription;

public class FreelancerDescriptionMapper {
    public static FreelancerDescriptionDTO mapToFreelancerDescriptionDTO(FreelancerDescription freelancerDescription){
        return new FreelancerDescriptionDTO(
                freelancerDescription.getUsername(),
                freelancerDescription.getDescription()
        );
    }
    public static FreelancerDescription mapToFreelancerDescription(FreelancerDescriptionDTO freelancerDescriptionDTO){
        return new FreelancerDescription(
                freelancerDescriptionDTO.getUsername(),
                freelancerDescriptionDTO.getDescription()
        );
    }
}
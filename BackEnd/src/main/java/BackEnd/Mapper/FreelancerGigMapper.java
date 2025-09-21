package BackEnd.Mapper;

import BackEnd.DTO.FreelancerGigsDTO;
import BackEnd.entity.FreelancerGigs;

public class FreelancerGigMapper {

    public static FreelancerGigsDTO mapToFreelancerGigsDto(FreelancerGigs freelancerGigs){
        return new FreelancerGigsDTO(
                freelancerGigs.getGigId(),
                freelancerGigs.getGigTitle(),
                freelancerGigs.getGigDescription(),
                freelancerGigs.getGigCategory(),
                freelancerGigs.getGigDateCreated(),
                freelancerGigs.getFreelancerUsername()
        );
    }

    public static FreelancerGigs mapToFreelancerGigs(FreelancerGigsDTO freelancerGigsDto){
        return new FreelancerGigs(
                freelancerGigsDto.getGigId(),
                freelancerGigsDto.getGigTitle(),
                freelancerGigsDto.getGigDescription(),
                freelancerGigsDto.getGigCategory(),
                freelancerGigsDto.getGigDateCreated(),
                freelancerGigsDto.getFreelancerUsername()
        );
    }
}

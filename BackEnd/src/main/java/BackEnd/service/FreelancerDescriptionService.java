package BackEnd.service;

import BackEnd.DTO.FreelancerDescriptionDTO;
import BackEnd.entity.FreelancerDescription;

public interface FreelancerDescriptionService {
    public FreelancerDescriptionDTO getFreelancerDescriptionByUsername(String username);

    public FreelancerDescriptionDTO addFreelancerDescription(String username, FreelancerDescription freelancerDescription);
}
package BackEnd.service;

import BackEnd.DTO.FreelancerDTO;

public interface ApplicationService {

    FreelancerDTO getFreelancerByUsername(String userName);
}

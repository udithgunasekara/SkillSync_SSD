package BackEnd.service;

import BackEnd.DTO.FreelancerEducationDTO;
import BackEnd.entity.FreelancerEducation;

import java.util.List;

public interface FreelancerEducationService {
    public List<FreelancerEducationDTO> getEducationByUsername(String username);

    public void deleteFreelancerEducationByusernameandId(String username,Long Id);

    public FreelancerEducationDTO addFreelancerEducation(String username, FreelancerEducation freelancerEducation);
}
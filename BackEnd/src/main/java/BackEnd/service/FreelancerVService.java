package BackEnd.service;

import BackEnd.DTO.FreelancerVDTO;

import java.util.List;

public interface FreelancerVService {
    public List<FreelancerVDTO> getAllFreelancers();
    public FreelancerVDTO getFreelancerByusername(String username);

    public void deleteFreelancerById(Long id);
}
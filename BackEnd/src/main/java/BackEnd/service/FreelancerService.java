package BackEnd.service;

import BackEnd.DTO.FreelancerDTO;
import BackEnd.DTO.LoginDTO;

import java.util.List;

public interface FreelancerService {

    FreelancerDTO createFreelancer(FreelancerDTO freelancerDto);

    List<FreelancerDTO> getAllInprogressFreelancers();

    FreelancerDTO getFreelancerByUsername(String username);

    //delete user account using username
    void deleteFreelancerByUsername(String username);

    String acceptFreelancer(String username);

    Long validateLogin(LoginDTO loginDTO);

    Boolean checkAccountStatus(String username);

//    FreelancerDTO getFreelancerById(Long id);
//
//    List<FreelancerDTO> getAllFreelancers();
    List<FreelancerDTO> getAllAcceptedFreelancers();
//
//    List<FreelancerDTO> getInProgressFreelancers();


}

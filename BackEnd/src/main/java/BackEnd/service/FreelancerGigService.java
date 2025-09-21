package BackEnd.service;

import BackEnd.DTO.FreelancerGigsDTO;

import java.util.List;

public interface FreelancerGigService {
    FreelancerGigsDTO createGig(FreelancerGigsDTO freelancerGigsDto);
    FreelancerGigsDTO getGigById(Long gigId);
    List<FreelancerGigsDTO> getAllGigs();
    FreelancerGigsDTO updateGig(Long gigId, FreelancerGigsDTO updatedFreelancerGig);
    void deleteGig(Long gigId);
    List<FreelancerGigsDTO>  getGigsByfreelancerUsername(String freelancerUsername);
    List<FreelancerGigsDTO>  findGigByFreelancerUsernameAndKeyword(String freelancerUsername,String keyword);
}

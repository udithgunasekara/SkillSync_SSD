package BackEnd.service;

import BackEnd.DTO.FreelancerLanguageDTO;
import BackEnd.entity.FreelancerLanguage;

import java.util.List;

public interface FreelancerLanguageService {
    public List<FreelancerLanguageDTO> getAllLanguagesForFreelancer(String username);
    public FreelancerLanguageDTO addFreelancerLanguage(FreelancerLanguage freelancerLanguage);

    public void deleteByusernameAndLanguage(String username,String language);
}

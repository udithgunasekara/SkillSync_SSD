package BackEnd.service.imple;

import BackEnd.DTO.FreelancerLanguageDTO;
import BackEnd.Mapper.FreelancerLanguageMapper;
import BackEnd.entity.FreelancerLanguage;
import BackEnd.repository.FreelancerLanguageRepository;
import BackEnd.service.FreelancerLanguageService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FreelancerLanguageServiceImp implements FreelancerLanguageService {
    @Autowired
    private FreelancerLanguageRepository freelancerLanguageRepository;
    @Override
    public List<FreelancerLanguageDTO> getAllLanguagesForFreelancer(String username) {
        List<FreelancerLanguage> languages = freelancerLanguageRepository.findByusername(username);
        return languages.stream().map(FreelancerLanguageMapper::mapToFreelancerLanguageDTO).
                collect(Collectors.toList());
    }
    @Override
    public FreelancerLanguageDTO addFreelancerLanguage(FreelancerLanguage freelancerLanguage) {
        FreelancerLanguage freelancerLanguage1 = freelancerLanguageRepository.save(freelancerLanguage);
        return FreelancerLanguageMapper.mapToFreelancerLanguageDTO(freelancerLanguage1);
    }

    @Override
    public void deleteByusernameAndLanguage(String username,String language){
        FreelancerLanguage freelancerLanguage = freelancerLanguageRepository.findByusernameAndLanguage(username,language);
        freelancerLanguageRepository.delete(freelancerLanguage);
    }
}
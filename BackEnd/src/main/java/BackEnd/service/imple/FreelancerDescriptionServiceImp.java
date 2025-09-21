package BackEnd.service.imple;

import BackEnd.DTO.FreelancerDescriptionDTO;
import BackEnd.Mapper.FreelancerDescriptionMapper;
import BackEnd.entity.FreelancerDescription;
import BackEnd.repository.FreelancerDescriptionRepository;
import BackEnd.service.FreelancerDescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FreelancerDescriptionServiceImp implements FreelancerDescriptionService {
    @Autowired
    private FreelancerDescriptionRepository freelancerDescriptionRepository;

    @Override
    public FreelancerDescriptionDTO getFreelancerDescriptionByUsername(String username) {
        FreelancerDescription freelancerDescription = freelancerDescriptionRepository.findByusername(username).orElse(null);
        if (freelancerDescription == null) {
            return null;
        }
        return FreelancerDescriptionMapper.mapToFreelancerDescriptionDTO(freelancerDescription);
    }

    @Override
    public FreelancerDescriptionDTO addFreelancerDescription(String username, FreelancerDescription freelancerDescription){
        FreelancerDescription freelancerDescription1 = freelancerDescriptionRepository.save(freelancerDescription);
        return FreelancerDescriptionMapper.mapToFreelancerDescriptionDTO(freelancerDescription1);
    }
}
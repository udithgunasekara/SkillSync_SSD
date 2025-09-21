package BackEnd.service.imple;

import BackEnd.DTO.FreelancerEducationDTO;
import BackEnd.Mapper.FreelancerEducationMapper;
import BackEnd.entity.FreelancerEducation;
import BackEnd.repository.FreelancerEducationRepository;
import BackEnd.service.FreelancerEducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FreelancerEducationServiceImp implements FreelancerEducationService {
    @Autowired
    private FreelancerEducationRepository freelancerEducationRepository;

    @Override
    public List<FreelancerEducationDTO> getEducationByUsername(String username) {
        List<FreelancerEducation> freelancerEducations= freelancerEducationRepository.findByUsername(username);
        return freelancerEducations.stream().map(FreelancerEducationMapper::mapToFreelancerEducationDTO).
                collect(Collectors.toList());
    }

    @Override
    public void deleteFreelancerEducationByusernameandId(String username,Long Id) {
        FreelancerEducation education = freelancerEducationRepository.findByusernameAndId(username,Id).orElseThrow(() ->new RuntimeException("Freelancer Education not found"));
        freelancerEducationRepository.delete(education);
    }

    @Override
    public FreelancerEducationDTO addFreelancerEducation(String username, FreelancerEducation freelancerEducation) {
        FreelancerEducation freelancerEducation1=freelancerEducationRepository.save(freelancerEducation);
        return FreelancerEducationMapper.mapToFreelancerEducationDTO(freelancerEducation1);
    }

}
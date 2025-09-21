package BackEnd.service.imple;

import BackEnd.DTO.FreelancerVDTO;
import BackEnd.Mapper.FreelancerVMapper;
import BackEnd.entity.Freelancer;
import BackEnd.repository.FreelancerVRepository;
import BackEnd.service.FreelancerVService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FreelancerVServiceImp implements FreelancerVService {

    @Autowired
    private FreelancerVRepository freelancerVRepository;

    @Override
    public List<FreelancerVDTO> getAllFreelancers() {
        List<Freelancer> freelancer = freelancerVRepository.findAll();
        return freelancer.stream().map(FreelancerVMapper::mapToFreelancerDTO).
                collect(Collectors.toList());
    }

    @Override
    public FreelancerVDTO getFreelancerByusername(String username) {
        Freelancer freelancer = freelancerVRepository.findByuserName(username).orElseThrow(() ->new RuntimeException("Freelancer not found"));
        return FreelancerVMapper.mapToFreelancerDTO(freelancer);
    }

    @Override
    public void deleteFreelancerById(Long id) {
        Freelancer freelancer = freelancerVRepository.findById(id).
                orElseThrow(() -> new RuntimeException("Freelancer not found with id : " + id));
        freelancerVRepository.delete(freelancer);
    }
}
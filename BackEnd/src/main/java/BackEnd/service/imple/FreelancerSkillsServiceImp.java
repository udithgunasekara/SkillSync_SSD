package BackEnd.service.imple;

import BackEnd.DTO.FreelancerSkillsDTO;
import BackEnd.Mapper.FreelancerSkillsMapper;
import BackEnd.entity.FreelancerSkills;
import BackEnd.repository.FreelancerSkillsRepository;
import BackEnd.service.FreelancerSkillsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FreelancerSkillsServiceImp implements FreelancerSkillsService {
    @Autowired
    private FreelancerSkillsRepository freelancerSkillsRepository;
    @Override
    public List<FreelancerSkillsDTO> getAllSkillsForFreelancer(String username) {
        List<FreelancerSkills> freelancerSkills=freelancerSkillsRepository.findByusername(username);
        return freelancerSkills.stream().map(FreelancerSkillsMapper::mapToFreelancerSkillsDTO).
                collect(Collectors.toList());

    }

    @Override
    @Transactional // Add Transactional annotation to manage transactions
    public FreelancerSkillsDTO addFreelancerSkill(FreelancerSkills freelancerSkills) {
        FreelancerSkills freelancerSkills1 = freelancerSkillsRepository.save(freelancerSkills);
        return FreelancerSkillsMapper.mapToFreelancerSkillsDTO(freelancerSkills1);
    }

    @Override
    @Transactional
    public void deleteByusernameAndSkill(String username, String skill) {
        FreelancerSkills freelancerSkills = freelancerSkillsRepository.findByusernameAndSkill(username, skill);
        freelancerSkillsRepository.delete(freelancerSkills);
    }

}

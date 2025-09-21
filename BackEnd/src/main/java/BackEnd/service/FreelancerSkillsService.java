package BackEnd.service;

import BackEnd.DTO.FreelancerSkillsDTO;
import BackEnd.entity.FreelancerSkills;

import java.util.List;
import java.util.stream.Collectors;

public interface FreelancerSkillsService {
    public List<FreelancerSkillsDTO> getAllSkillsForFreelancer(String username);
    public FreelancerSkillsDTO addFreelancerSkill(FreelancerSkills freelancerSkills);
    public void deleteByusernameAndSkill(String username, String skill);
}
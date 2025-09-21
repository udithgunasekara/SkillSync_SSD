package BackEnd.Mapper;

import BackEnd.DTO.FreelancerSkillsDTO;
import BackEnd.entity.FreelancerSkills;

public class FreelancerSkillsMapper {
    public static FreelancerSkillsDTO mapToFreelancerSkillsDTO(FreelancerSkills freelancerSkills){
        return new FreelancerSkillsDTO(
                freelancerSkills.getId(),
                freelancerSkills.getUsername(),
                freelancerSkills.getSkill()
        );
    }
    public static FreelancerSkills mapToFreelancerSkills(FreelancerSkillsDTO freelancerSkillsDTO){
        return new FreelancerSkills(
                freelancerSkillsDTO.getId(),
                freelancerSkillsDTO.getUsername(),
                freelancerSkillsDTO.getSkill()
        );
    }
}
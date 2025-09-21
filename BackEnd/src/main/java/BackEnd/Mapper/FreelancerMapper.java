package BackEnd.Mapper;

import BackEnd.DTO.LoginDTO;
import BackEnd.entity.BannedUser;
import BackEnd.DTO.FreelancerDTO;
import BackEnd.entity.Freelancer;


public class FreelancerMapper {

    //No monitoring. need to verfiy maptofreelancerDTO
        public static Freelancer mapToFreelancer(FreelancerDTO freelancerDTO) {
            Freelancer freelancer = new Freelancer();
            freelancer.setId(freelancerDTO.getId());
            freelancer.setFirstName(freelancerDTO.getFirstName());
            freelancer.setLastName(freelancerDTO.getLastName());
            freelancer.setEmail(freelancerDTO.getEmail());
            freelancer.setDob(freelancerDTO.getDob());
            freelancer.setNic(freelancerDTO.getNic());
            freelancer.setPhone(freelancerDTO.getPhone());
            freelancer.setUserName(freelancerDTO.getUserName());
            freelancer.setPassword(freelancerDTO.getPassword());
            freelancer.setWorkOn(freelancerDTO.getWorkOn());
            return freelancer;


        }

        public static FreelancerDTO mapToFreelancerDTO(Freelancer freelancer) {
            return new FreelancerDTO(
                    freelancer.getId(),
                    freelancer.getFirstName(),
                    freelancer.getLastName(),
                    freelancer.getEmail(),
                    freelancer.getDob(),
                    freelancer.getNic(),
                    freelancer.getLevel(),
                    freelancer.getPhone(),
                    freelancer.getUserName(),
                    freelancer.getPassword(),
                    freelancer.getWorkOn(),
                    freelancer.getCreated_at(),
                    freelancer.getInterviews()
            );
        }

        public static BannedUser mapToBannedUser(Freelancer freelancer){
            BannedUser bannedUser = new BannedUser();
            bannedUser.setFirstName(freelancer.getFirstName());
            bannedUser.setLastName(freelancer.getLastName());
            bannedUser.setEmail(freelancer.getEmail());
            bannedUser.setDob(freelancer.getDob());
            bannedUser.setPhone(freelancer.getPhone());
            bannedUser.setNic(freelancer.getNic());

            return bannedUser;
        }

        public static Freelancer mapToFreelancerLogin(LoginDTO loginDTO){
            Freelancer freelancer = new Freelancer();
            freelancer.setUserName(loginDTO.getUsername());
            freelancer.setPassword(loginDTO.getPassword());
            return freelancer;
        }





}



package BackEnd.Mapper;

import BackEnd.DTO.ClientDTO;
import BackEnd.DTO.FreelancerDTO;
import BackEnd.entity.UserCredential;

public class UserControllerMapper {

    //Client to userController mapping
    public static UserCredential mapToUserCredential(ClientDTO client){
        UserCredential userCredential = new UserCredential();

        userCredential.setUsername(client.getUserName());
        userCredential.setPassword(client.getPassword());
        userCredential.setRole("client");
        return userCredential;
    }

    //Freelancer to userController mapping
    public static UserCredential mapFreelancerToUserCredential(FreelancerDTO freelancer){
        UserCredential userCredential = new UserCredential();

        userCredential.setUsername(freelancer.getUserName());
        userCredential.setPassword(freelancer.getPassword());
        userCredential.setRole("freelancer");
        return userCredential;
    }


}

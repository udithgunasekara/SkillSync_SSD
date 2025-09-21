package BackEnd.service.imple;

import BackEnd.DTO.FreelancerDTO;
import BackEnd.DTO.LoginDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.FreelancerMapper;
import BackEnd.Mapper.UserControllerMapper;
import BackEnd.repository.QualificationHandlerRepo;
import BackEnd.entity.BannedUser;
import BackEnd.entity.Freelancer;
import BackEnd.entity.UserCredential;
import BackEnd.repository.BannedUserRepo;
import BackEnd.repository.UserCredentialRepo;
import BackEnd.repository.FreelancerRepo;
import BackEnd.service.FreelancerService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FreelancerServiceImp implements FreelancerService {

    private FreelancerRepo freelancerRepo;
    private UserCredentialRepo userCredentialRepo;
    private QualificationHandlerRepo qualificationHandlerRepo;
    private BannedUserRepo bannedUserRepo;
    private ModelMapper modelMapper;

    //save freelancer values in DB
    public FreelancerDTO createFreelancer(FreelancerDTO freelancerDTO) {

        //save freelancer values
        Freelancer freelancer = FreelancerMapper.mapToFreelancer(freelancerDTO);
        Freelancer saveFreelancer = freelancerRepo.save(freelancer);

        //save user credentials
        UserCredential userCredential = UserControllerMapper.mapFreelancerToUserCredential(freelancerDTO);
        UserCredential savedUserCredential = userCredentialRepo.save(userCredential);

        return FreelancerMapper.mapToFreelancerDTO(saveFreelancer);
    }

    //Getting list of all freelancers who are in "Inprogress" state
    @Override
    public List<FreelancerDTO> getAllInprogressFreelancers() {
        List<Freelancer> freelancers = freelancerRepo.findInProgressFreelancers();
        return freelancers.stream()
                .map(FreelancerMapper::mapToFreelancerDTO)
                .collect(Collectors.toList());
    }


    //in this get freelancer bio data using username. help in Individual Application review page
    @Override
    public FreelancerDTO getFreelancerByUsername(String username) {
        Freelancer freelancer = freelancerRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFound("Freelancer not found for this username: " + username));
        return FreelancerMapper.mapToFreelancerDTO(freelancer);
    }

    @Override
    public void deleteFreelancerByUsername(String username) {

        //Delete from freelancer table
        Freelancer freelancer = freelancerRepo.findByUserName(username);

        //Delete from user credential table
        UserCredential userCredential = userCredentialRepo.findByUserName(username);

        //Delete From image table (delete all image data)
        //TODO Delete from image table
        qualificationHandlerRepo.deleteByUserName(username);

        //insert freelancer data into Bannded user table
        BannedUser bannedUser = FreelancerMapper.mapToBannedUser(freelancer);
        bannedUserRepo.save(bannedUser);

        //delete freelancer
        freelancerRepo.delete(freelancer);
        userCredentialRepo.delete(userCredential);



    }

    @Override
    public String acceptFreelancer(String username) {
        String app_status = "Accept";
        Freelancer freelancer = freelancerRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFound("Freelancer not found for this username: " + username));
        //set accepted status
        freelancer.setApp_status(app_status);

        //TODO : Delete images from image table

        freelancerRepo.save(freelancer);
        return null;
    }

    //freelancer Login checking
    @Override
    public Long validateLogin(LoginDTO loginDTO) {
        Freelancer freelancer = freelancerRepo.findByUserName(loginDTO.getUsername());
        long userid = freelancer.getId();
        if (freelancer != null && freelancer.getPassword().equals(loginDTO.getPassword())) {
            return userid;
        }
        return null ;
    }

    @Override
    public Boolean checkAccountStatus(String username) {
        String result = freelancerRepo.findAcceptedFreelancer(username);
        if(Objects.equals(result, "Accept")){
            return true;
        }else {
            return false;
        }
    }

    @Override
    public List<FreelancerDTO> getAllAcceptedFreelancers() {
        List<Freelancer> freelancers = freelancerRepo.findAllAcceptedFreelancers();
        return freelancers.stream()
                .map(FreelancerMapper::mapToFreelancerDTO)
                .collect(Collectors.toList());
    }


}

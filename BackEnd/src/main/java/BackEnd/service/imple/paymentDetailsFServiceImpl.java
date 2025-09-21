package BackEnd.service.imple;

import BackEnd.DTO.paymentDetailsFreelancerDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.paymentDetailsFreelancerMapper;
import BackEnd.entity.paymentDetailsFreelancer;
import BackEnd.repository.paymentDetailsFreelancerRepo;
import BackEnd.service.paymentDetailsFreelancerService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service

public class paymentDetailsFServiceImpl implements paymentDetailsFreelancerService {

    @Autowired
    private paymentDetailsFreelancerRepo paymentDetailsFreelancerRepo;

//    @Autowired
//    public paymentDetailsFServiceImpl(paymentDetailsFreelancerRepo paymentDetailsFreelancerRepo) {
//        this.paymentDetailsFreelancerRepo = paymentDetailsFreelancerRepo;
//    }

    @Override
    public paymentDetailsFreelancerDTO addDetails(paymentDetailsFreelancerDTO paymentDTO) {

        paymentDetailsFreelancer paymentFreelancer = paymentDetailsFreelancerMapper.mapTopaymentDetailsFreelancer(paymentDTO);

//        //Manually Assign an ID
//        paymentDetailsFreelancer.setId(paymentDetailsFreelancerDTO.getId());
        paymentDetailsFreelancer savedPayDetailsF = paymentDetailsFreelancerRepo.save(paymentFreelancer);

        return paymentDetailsFreelancerMapper.mapTopaymentDetailsFreelancerDTO(savedPayDetailsF);
    }

    @Override
    public paymentDetailsFreelancerDTO getDetailsByUserName(String userName) {
        paymentDetailsFreelancer paymentDetailsFreelancer = paymentDetailsFreelancerRepo.findByUserName(userName);
//                .orElseThrow(() ->
//                        new ResourceNotFound("Details is not exists with given user name : " + userName));
        return paymentDetailsFreelancerMapper.mapTopaymentDetailsFreelancerDTO(paymentDetailsFreelancer);
    }





    @Override
    public paymentDetailsFreelancerDTO updateDetails(String userName, paymentDetailsFreelancerDTO updatedDetails) {
        paymentDetailsFreelancer paymentDetailsFreelancer = paymentDetailsFreelancerRepo.findByUserName(userName);
//        .orElseThrow(
//                () -> new ResourceNotFound("Details not found with given id: " + userName)



        paymentDetailsFreelancer.setUserName(userName);
        paymentDetailsFreelancer.setFullName(updatedDetails.getFullName());
        paymentDetailsFreelancer.setCountry(updatedDetails.getCountry());
        paymentDetailsFreelancer.setState(updatedDetails.getState());
        paymentDetailsFreelancer.setAddress(updatedDetails.getAddress());
        paymentDetailsFreelancer.setCity(updatedDetails.getCity());
        paymentDetailsFreelancer.setPostalCode(updatedDetails.getPostalCode());
        paymentDetailsFreelancer.setPaypalAddress(updatedDetails.getPaypalAddress());

        paymentDetailsFreelancer updatedDetailsObj = paymentDetailsFreelancerRepo.save(paymentDetailsFreelancer);


        return paymentDetailsFreelancerMapper.mapTopaymentDetailsFreelancerDTO(updatedDetailsObj);
    }

    @Override
    @Transactional
    public void deleteDetails(String userName) {

        paymentDetailsFreelancer paymentDetailsFreelancer = paymentDetailsFreelancerRepo.findByUserName(userName);
        //error handling


        paymentDetailsFreelancerRepo.deleteByUserName(userName);
    }
}

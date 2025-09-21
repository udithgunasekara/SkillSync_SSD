package BackEnd.service;

import BackEnd.DTO.paymentDetailsFreelancerDTO;
import BackEnd.entity.paymentDetailsFreelancer;
import org.springframework.stereotype.Service;


public interface paymentDetailsFreelancerService  {
    paymentDetailsFreelancerDTO addDetails(paymentDetailsFreelancerDTO paymentDetailsFreelancerDTO);

    paymentDetailsFreelancerDTO getDetailsByUserName(String userName);

    paymentDetailsFreelancerDTO updateDetails(String userName, paymentDetailsFreelancerDTO updatedDetails);

    void deleteDetails(String userName);
}

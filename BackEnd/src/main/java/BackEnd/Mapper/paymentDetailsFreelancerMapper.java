package BackEnd.Mapper;

import BackEnd.DTO.paymentDetailsFreelancerDTO;
import BackEnd.entity.paymentDetailsFreelancer;

public class paymentDetailsFreelancerMapper {

    public static paymentDetailsFreelancerDTO mapTopaymentDetailsFreelancerDTO(paymentDetailsFreelancer paymentDetailsFreelancer){
        return new paymentDetailsFreelancerDTO(
                paymentDetailsFreelancer.getId(),
                paymentDetailsFreelancer.getUserName(),
                paymentDetailsFreelancer.getFullName(),
                paymentDetailsFreelancer.getCountry(),
                paymentDetailsFreelancer.getState(),
                paymentDetailsFreelancer.getAddress(),
                paymentDetailsFreelancer.getCity(),
                paymentDetailsFreelancer.getPostalCode(),
                paymentDetailsFreelancer.getPaypalAddress()
        );
    }

    public static paymentDetailsFreelancer mapTopaymentDetailsFreelancer(paymentDetailsFreelancerDTO paymentDetailsFreelancerDTO){
        return new paymentDetailsFreelancer(
                paymentDetailsFreelancerDTO.getId(),
                paymentDetailsFreelancerDTO.getUserName(),
                paymentDetailsFreelancerDTO.getFullName(),
                paymentDetailsFreelancerDTO.getCountry(),
                paymentDetailsFreelancerDTO.getState(),
                paymentDetailsFreelancerDTO.getAddress(),
                paymentDetailsFreelancerDTO.getCity(),
                paymentDetailsFreelancerDTO.getPostalCode(),
                paymentDetailsFreelancerDTO.getPaypalAddress()

        );
    }

}

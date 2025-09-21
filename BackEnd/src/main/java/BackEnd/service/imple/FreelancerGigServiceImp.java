package BackEnd.service.imple;

import BackEnd.DTO.FreelancerGigsDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.FreelancerGigMapper;
import BackEnd.entity.FreelancerGigs;
import BackEnd.repository.FreelancerGigsRepo;
import BackEnd.service.FreelancerGigService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FreelancerGigServiceImp implements FreelancerGigService {

    private final FreelancerGigsRepo freelancerGigsRepo;

    @Override
    public FreelancerGigsDTO createGig(FreelancerGigsDTO freelancerGigsDto) {
        FreelancerGigs freelancerGigs = FreelancerGigMapper.mapToFreelancerGigs(freelancerGigsDto);
        FreelancerGigs savedGig = freelancerGigsRepo.save(freelancerGigs);
        return FreelancerGigMapper.mapToFreelancerGigsDto(savedGig);
    }

    @Override
    public FreelancerGigsDTO getGigById(Long gigId) {
        FreelancerGigs freelancerGigs = freelancerGigsRepo.findById(gigId).
                orElseThrow(() -> new RuntimeException("Gig not found"));
        return FreelancerGigMapper.mapToFreelancerGigsDto(freelancerGigs);
    }


    @Override
    public List<FreelancerGigsDTO> getAllGigs() {
        List<FreelancerGigs> freelancerGigs = freelancerGigsRepo.findAll();
        return freelancerGigs.stream().map(FreelancerGigMapper::mapToFreelancerGigsDto).
                collect(Collectors.toList());
    }
    @Override
    public FreelancerGigsDTO updateGig(Long gigId, FreelancerGigsDTO updatedFreelancerGig) {
        FreelancerGigs freelancerGigs = freelancerGigsRepo.findById(gigId).
                orElseThrow(() -> new ResourceNotFound("Gig not found with id : " + gigId));

        freelancerGigs.setGigTitle(updatedFreelancerGig.getGigTitle());
        freelancerGigs.setGigDescription(updatedFreelancerGig.getGigDescription());
        freelancerGigs.setGigCategory(updatedFreelancerGig.getGigCategory());

        FreelancerGigs updatedGig = freelancerGigsRepo.save(freelancerGigs);
        return FreelancerGigMapper.mapToFreelancerGigsDto(updatedGig);
    }

    @Override
    public void deleteGig(Long gigId) {
        FreelancerGigs freelancerGigs = freelancerGigsRepo.findById(gigId).
                orElseThrow(() -> new RuntimeException("Gig not found with id : " + gigId));
        freelancerGigsRepo.delete(freelancerGigs);

    }

    @Override
    public List<FreelancerGigsDTO> getGigsByfreelancerUsername(String freelancerUsername) {
        List<FreelancerGigs> freelancerGigs = freelancerGigsRepo.findByfreelancerUsername(freelancerUsername);
        return freelancerGigs.stream().map(FreelancerGigMapper::mapToFreelancerGigsDto).
                collect(Collectors.toList());
    }

    @Override
    public List<FreelancerGigsDTO> findGigByFreelancerUsernameAndKeyword(String freelancerUsername,String keyword) {
        List<FreelancerGigs> freelancerGigs = freelancerGigsRepo.findGigByFreelancerUsernameAndKeyword(freelancerUsername,keyword);
        return freelancerGigs.stream().map(FreelancerGigMapper::mapToFreelancerGigsDto).
                collect(Collectors.toList());
    }

}

package BackEnd.service.imple;

import BackEnd.DTO.UserAttemptsDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.UserAttemptsMapper;
import BackEnd.entity.UserAttempts;
import BackEnd.repository.UserAttemptsRepository;
import BackEnd.service.UserAttemptsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserAttemptsServiceIMPL implements UserAttemptsService {

    private UserAttemptsRepository userAttemptsRepository;
    @Override
    public UserAttemptsDTO saveAttempt(UserAttemptsDTO userAttemptsDTO) {
        UserAttempts userAttempts = UserAttemptsMapper.mapToUserAttempts(userAttemptsDTO);
        UserAttempts savedUserAttempts = userAttemptsRepository.save(userAttempts);
        return UserAttemptsMapper.mapToUserAttemptsDTO(savedUserAttempts);
    }

    @Override
    public UserAttemptsDTO getUserAttemptsById(String userName, Long examId) {
        UserAttempts userAttempts = userAttemptsRepository.findUserAttemptsByid(userName, examId);
        if (userAttempts == null) {
            throw new ResourceNotFound("Result not found for user: " + userName + " and examId: " + examId);
        }
        return UserAttemptsMapper.mapToUserAttemptsDTO(userAttempts);
    }

    @Override
    public UserAttemptsDTO updateUserAttemptsById(String userName, Long examId, UserAttemptsDTO userAttemptsDTO) {
        UserAttempts userAttempts = userAttemptsRepository.findUserAttemptsByid(userName, examId);
        userAttempts.setNoOfAttempts(userAttemptsDTO.getNoOfAttempts());
        UserAttempts updatedUserAttempts = userAttemptsRepository.save(userAttempts);
        return UserAttemptsMapper.mapToUserAttemptsDTO(updatedUserAttempts);
    }
}

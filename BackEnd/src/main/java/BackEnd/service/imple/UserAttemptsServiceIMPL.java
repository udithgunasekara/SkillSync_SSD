package BackEnd.service.imple;

import BackEnd.DTO.UserAttemptsDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.UserAttemptsMapper;
import BackEnd.entity.UserAttempts;
import BackEnd.repository.UserAttemptsRepository;
import BackEnd.service.InputValidationService;
import BackEnd.service.UserAttemptsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class UserAttemptsServiceIMPL implements UserAttemptsService {

    private UserAttemptsRepository userAttemptsRepository;
    private InputValidationService inputValidationService;

    @Override
    @Transactional
    public UserAttemptsDTO saveAttempt(UserAttemptsDTO userAttemptsDTO) {
        // FIXED: Add input validation
        inputValidationService.validateUsername(userAttemptsDTO.getUserName());
        inputValidationService.validateId(userAttemptsDTO.getExamId());
        
        UserAttempts userAttempts = UserAttemptsMapper.mapToUserAttempts(userAttemptsDTO);
        UserAttempts savedUserAttempts = userAttemptsRepository.save(userAttempts);
        return UserAttemptsMapper.mapToUserAttemptsDTO(savedUserAttempts);
    }

    @Override
    public UserAttemptsDTO getUserAttemptsById(String userName, Long examId) {
        // FIXED: Add input validation
        inputValidationService.validateUsername(userName);
        inputValidationService.validateId(examId);
        
        // FIXED: Use safe repository method with Optional
        UserAttempts userAttempts = userAttemptsRepository
            .findByUserNameAndExamId(userName, examId)
            .orElseThrow(() -> new ResourceNotFound(
                "Result not found for user: " + userName + " and examId: " + examId));
        
        return UserAttemptsMapper.mapToUserAttemptsDTO(userAttempts);
    }

    @Override
    @Transactional
    public UserAttemptsDTO updateUserAttemptsById(String userName, Long examId, UserAttemptsDTO userAttemptsDTO) {
        // FIXED: Add comprehensive input validation
        inputValidationService.validateUsername(userName);
        inputValidationService.validateId(examId);
        
        if (userAttemptsDTO.getNoOfAttempts() < 0) {
            throw new IllegalArgumentException("Number of attempts cannot be negative");
        }
        
        // FIXED: Use safe repository method with proper error handling
        UserAttempts userAttempts = userAttemptsRepository
            .findByUserNameAndExamId(userName, examId)
            .orElseThrow(() -> new ResourceNotFound(
                "User attempts not found for user: " + userName + " and examId: " + examId));
        
        userAttempts.setNoOfAttempts(userAttemptsDTO.getNoOfAttempts());
        UserAttempts updatedUserAttempts = userAttemptsRepository.save(userAttempts);
        return UserAttemptsMapper.mapToUserAttemptsDTO(updatedUserAttempts);
    }
}

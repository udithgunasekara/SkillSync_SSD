package BackEnd.service.imple;

import BackEnd.DTO.UserResultDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.UserResultMapper;
import BackEnd.entity.UserResult;
import BackEnd.repository.UserResultRepository;
import BackEnd.service.UserResultService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserResultServiceIMPL implements UserResultService {

    private UserResultRepository userResultRepository;
    @Override
    public UserResultDTO saveUSerResult(UserResultDTO userResultDTO) {
        UserResult userResult = UserResultMapper.maptoUserResult(userResultDTO);
        UserResult savedUserResult = userResultRepository.save(userResult);
        return UserResultMapper.mapToUserResultDTO(savedUserResult);
    }

    @Override
    public List<UserResultDTO> getSavedResultByExamId() {
        List<UserResult> allResult = userResultRepository.findAll();
        return allResult.stream().map((result) -> UserResultMapper.mapToUserResultDTO(result)).collect(Collectors.toList());
    }

    @Override
    public List<UserResultDTO> getSavedResultByUserName(String userName) {
        List<UserResult> userResults = userResultRepository.findUserResultByusername(userName);
        return userResults.stream().map((result) -> UserResultMapper.mapToUserResultDTO(result)).collect(Collectors.toList());
    }

    @Override
    public UserResultDTO getSavedResultById(String userName, Long examId) {
        UserResult userResult = userResultRepository.findUserResultByid(userName, examId);
        if (userResult == null) {
            throw new ResourceNotFound("Result not found for user: " + userName + " and examId: " + examId);
        }
        return UserResultMapper.mapToUserResultDTO(userResult);
    }
}

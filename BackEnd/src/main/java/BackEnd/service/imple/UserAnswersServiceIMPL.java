package BackEnd.service.imple;

import BackEnd.DTO.UserAnswersDTO;
import BackEnd.Mapper.UserAnswersMapper;
import BackEnd.entity.UserAnswers;
import BackEnd.repository.UserAnswersRepository;
import BackEnd.service.UserAnswersService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserAnswersServiceIMPL implements UserAnswersService {

    private UserAnswersRepository userAnswersRepository;
    @Override
    public UserAnswersDTO saveAnswer(UserAnswersDTO userAnswersDTO) {
        UserAnswers userAnswers = UserAnswersMapper.mapToUserAnswers(userAnswersDTO);
        UserAnswers savedUserAnswers = userAnswersRepository.save(userAnswers);
        return UserAnswersMapper.mapToUserAnswerDTO(savedUserAnswers);
    }
}

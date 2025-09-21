package BackEnd.Mapper;

import BackEnd.DTO.UserAnswersDTO;
import BackEnd.entity.UserAnswers;

public class UserAnswersMapper {
    public static UserAnswersDTO mapToUserAnswerDTO(UserAnswers userAnswers){
        return new UserAnswersDTO(
                userAnswers.getUserNamePk(),
                userAnswers.getQuestionIdPk(),
                userAnswers.getSelectedOptionId()
        );
    }

    public static UserAnswers mapToUserAnswers(UserAnswersDTO userAnswersDTO){
        return new UserAnswers(
                userAnswersDTO.getUserNamePk(),
                userAnswersDTO.getQuestionIdPk(),
                userAnswersDTO.getSelectedOptionId()
        );
    }
}

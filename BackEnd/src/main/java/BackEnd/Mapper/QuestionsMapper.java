package BackEnd.Mapper;

import BackEnd.DTO.QuestionsDTO;
import BackEnd.entity.Questions;

public class QuestionsMapper {

    public static QuestionsDTO mapToQuestionsDTO(Questions questions){
        return new QuestionsDTO(
                questions.getQuestionId(),
                questions.getQuestionTxt(),
                questions.getExamId(),
                questions.getOptions()
        );
    }

    public static Questions mapToQuestions(QuestionsDTO questionsDTO){
        return new Questions(
                questionsDTO.getQuestionId(),
                questionsDTO.getQuestionTxt(),
                questionsDTO.getExamId(),
                questionsDTO.getOptions()
        );
    }
}

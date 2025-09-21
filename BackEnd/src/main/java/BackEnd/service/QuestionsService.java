package BackEnd.service;

import BackEnd.DTO.QuestionsDTO;

public interface QuestionsService {

    QuestionsDTO createQuestion(Long examId, QuestionsDTO questionsDTO);

    QuestionsDTO getQuestionById(Long questionId);

    QuestionsDTO updateQuestionById(Long questionId, QuestionsDTO questionsDTO);

    void deleteQuestionById(Long questionId);
}

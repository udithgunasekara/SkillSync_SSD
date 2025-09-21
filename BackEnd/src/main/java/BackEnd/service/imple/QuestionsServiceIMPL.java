package BackEnd.service.imple;

import BackEnd.DTO.QuestionsDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.QuestionsMapper;
import BackEnd.entity.Questions;
import BackEnd.repository.QuestionsRepository;
import BackEnd.service.QuestionsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class QuestionsServiceIMPL implements QuestionsService {

    private QuestionsRepository questionsRepository;
    @Override
    public QuestionsDTO createQuestion(Long examID, QuestionsDTO questionsDTO) {

        Questions questions = QuestionsMapper.mapToQuestions(questionsDTO);
        questions.setExamId(examID);
        Questions savedQuestions = questionsRepository.save(questions);
        return QuestionsMapper.mapToQuestionsDTO(savedQuestions);
    }

    @Override
    public QuestionsDTO getQuestionById(Long questionId) {
        Questions questions = questionsRepository.findById(questionId).orElseThrow(
                () -> new ResourceNotFound("Question is not exists with given Id : " + questionId)
        );
        return QuestionsMapper.mapToQuestionsDTO(questions);
    }

    @Override
    public QuestionsDTO updateQuestionById(Long questionId, QuestionsDTO questionsDTO) {
        Questions questions = questionsRepository.findById(questionId).orElseThrow(
                () -> new ResourceNotFound("Question is not exists with given Id : " + questionId)
        );

        questions.setQuestionTxt(questionsDTO.getQuestionTxt());

        Questions updatedQuestionsobj = questionsRepository.save(questions);

        return QuestionsMapper.mapToQuestionsDTO(updatedQuestionsobj);
    }

    @Override
    public void deleteQuestionById(Long questionId) {
        Questions questions = questionsRepository.findById(questionId).orElseThrow(
                () -> new ResourceNotFound("Question is not exists with given Id : " + questionId)
        );

        questionsRepository.deleteById(questionId);

    }
}

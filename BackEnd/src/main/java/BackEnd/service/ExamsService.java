package BackEnd.service;

import BackEnd.DTO.ExamsDTO;

import java.util.List;

public interface ExamsService {

    ExamsDTO createExam(ExamsDTO examsDTO);

    ExamsDTO getExamById(Long examid);

    ExamsDTO updateExamById(Long examid, ExamsDTO examsDTO);

    void deleteExamById(Long examId);

    List<ExamsDTO> getAllExams();
}

package BackEnd.Mapper;

import BackEnd.DTO.ExamsDTO;
import BackEnd.entity.Exams;

public class ExamsMapper {

    public static ExamsDTO mapToExamsDTO(Exams exams){
        return new ExamsDTO(
                exams.getId(),
                exams.getExamName(),
                exams.getExamDescription(),
                exams.getNoOfAttempts(),
                exams.getTimeLimit(),
                exams.getBadgeName(),
                exams.getBadge(),
                exams.getCreditPoint(),
                exams.getQuestions()
        );
    }

    public static Exams mapToExams(ExamsDTO examsDTO){
        return new Exams(
                examsDTO.getId(),
                examsDTO.getExamName(),
                examsDTO.getExamDescription(),
                examsDTO.getNoOfAttempts(),
                examsDTO.getTimeLimit(),
                examsDTO.getBadgeName(),
                examsDTO.getBadge(),
                examsDTO.getCreditPoint(),
                examsDTO.getQuestions()
        );
    }
}
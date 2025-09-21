package BackEnd.service.imple;

import BackEnd.DTO.ExamsDTO;
import BackEnd.Exceptions.ResourceNotFound;
import BackEnd.Mapper.ExamsMapper;
import BackEnd.entity.Exams;
import BackEnd.repository.ExamsRepository;
import BackEnd.service.ExamsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ExamsServiceIMPL implements ExamsService {

    private ExamsRepository examsRepository;
    @Override
    public ExamsDTO createExam(ExamsDTO examsDTO) {

        Exams exams = ExamsMapper.mapToExams(examsDTO);
        Exams savedExam = examsRepository.save(exams);
        return ExamsMapper.mapToExamsDTO(savedExam);
    }

    @Override
    public ExamsDTO getExamById(Long examid) {
        Exams exams = examsRepository.findById(examid).orElse(null);
        return ExamsMapper.mapToExamsDTO(exams);
    }

    @Override
    public ExamsDTO updateExamById(Long examid, ExamsDTO examsDTO) {
        Exams exams = examsRepository.findById(examid).orElseThrow(
                () -> new ResourceNotFound("Exam is not exists with given Id : " + examid)
        );

        exams.setExamName(examsDTO.getExamName());
        exams.setExamDescription(examsDTO.getExamDescription());
        exams.setNoOfAttempts(examsDTO.getNoOfAttempts());
        exams.setTimeLimit(examsDTO.getTimeLimit());
        exams.setCreditPoint(examsDTO.getCreditPoint());
        exams.setBadgeName(examsDTO.getBadgeName());
        exams.setBadge(examsDTO.getBadge());

        Exams updatedexamobj = examsRepository.save(exams);

        return ExamsMapper.mapToExamsDTO(updatedexamobj);
    }

    @Override
    public void deleteExamById(Long examId) {
        Exams exams = examsRepository.findById(examId).orElseThrow(
                () -> new ResourceNotFound("Exam is not exists with given Id : " + examId)
        );

        examsRepository.deleteById(examId);
    }

    @Override
    public List<ExamsDTO> getAllExams() {
        List<Exams> allExam = examsRepository.findAll();
        return allExam.stream().map((exams) -> ExamsMapper.mapToExamsDTO(exams)).collect(Collectors.toList());
    }
}

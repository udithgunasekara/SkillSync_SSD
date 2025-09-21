package BackEnd.repository;

import BackEnd.entity.UserAnswerPKId;
import BackEnd.entity.UserAnswers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAnswersRepository extends JpaRepository<UserAnswers, UserAnswerPKId> {
}
package BackEnd.repository;

import BackEnd.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversation(Long conversation);

    @Query(value = "SELECT m FROM Message m WHERE m.conversation = ?1 ORDER BY m.sentAt DESC LIMIT 1")
    Optional<Message> findLatestMessageByConversationId(Long conversation);

}
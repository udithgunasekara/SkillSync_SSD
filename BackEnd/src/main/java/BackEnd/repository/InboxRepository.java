package BackEnd.repository;

import BackEnd.entity.Inbox;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InboxRepository extends JpaRepository<Inbox,Long> {
    List<Inbox> findByusername(String username);

    @Modifying
    @Transactional
    @Query("UPDATE Inbox i SET i.isRead = true WHERE i.conversationId = :id and i.username= :username")
    int markAsRead(@Param("id") Long conversationId,@Param("username") String username);

    Inbox findByConversationIdAndUsername(Long conversationId, String username);

    List<Inbox> findByconversationId(Long conversationId);
}
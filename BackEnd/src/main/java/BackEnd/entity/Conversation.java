package BackEnd.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Entity
@Getter
@Setter
//@AllArgsConstructor
//@NoArgsConstructor
@Table(name = "Conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "conversation_id")
    private Long conversationId;

    @Column(name = "user1_id", nullable = false)
    private String user1;

    @Column(name = "user2_id", nullable = false)
    private String user2;

    @Column(name = "started_at")
    private Date startedAt;

    public Conversation(Long conversationId, String user1, String user2, Date startedAt) {
        this.conversationId = conversationId;
        this.user1 = user1;
        this.user2 = user2;
        this.startedAt = startedAt;
    }

    public Conversation() {
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public String getUser1() {
        return user1;
    }

    public void setUser1(String user1) {
        this.user1 = user1;
    }

    public String getUser2() {
        return user2;
    }

    public void setUser2(String user2) {
        this.user2 = user2;
    }

    public Date getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Date startedAt) {
        this.startedAt = startedAt;
    }
}
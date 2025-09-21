package BackEnd.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
//@AllArgsConstructor
//@NoArgsConstructor
@Table(name = "Inbox")
public class Inbox {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inbox_id")
    private Long inboxId;
    @Column(name = "username")
    private String username;
    @Column(name = "user2")
    private String user2;
    @Column(name = "conversation_id")
    private Long conversationId;

    @Column(name = "message_id", columnDefinition = "TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String message;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "is_archived")
    private Boolean isArchived;

    public Inbox(Long inboxId,String username, String user2, Long conversationId, String message, Boolean isRead, Boolean isArchived) {
        this.inboxId=inboxId;
        this.username = username;
        this.user2 = user2;
        this.conversationId = conversationId;
        this.message = message;
        this.isRead = isRead;
        this.isArchived = isArchived;
    }

    public Inbox() {
    }

    public Long getInboxId() {
        return inboxId;
    }

    public void setInboxId(Long inboxId) {
        this.inboxId = inboxId;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getRead() {
        return isRead;
    }

    public void setRead(Boolean read) {
        isRead = read;
    }

    public Boolean getArchived() {
        return isArchived;
    }

    public void setArchived(Boolean archived) {
        isArchived = archived;
    }

    public String getUser2() {
        return user2;
    }

    public void setUser2(String user2) {
        this.user2 = user2;
    }
}
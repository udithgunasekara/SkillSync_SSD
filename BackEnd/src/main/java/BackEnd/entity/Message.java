package BackEnd.entity;

import jakarta.persistence.*;
//import javax.persistence.TableOption;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
//@AllArgsConstructor
//@NoArgsConstructor
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;

    @Column(name = "sender_id")
    private String sender;

    @Column(name = "receiver_id")
    private String receiver;

    @Column(name = "conversation_id")
    private Long conversation;

    @Column(name = "message_text", columnDefinition = "TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String messageText;

    @Column(name = "sent_at", columnDefinition = "TIMESTAMP")
    private Timestamp sentAt;

    public Message(Long messageId, String sender, String receiver, Long conversation, String messageText, Timestamp sentAt) {
        this.messageId = messageId;
        this.sender = sender;
        this.receiver = receiver;
        this.conversation = conversation;
        this.messageText = messageText;
        this.sentAt = sentAt;
    }

    public Message() {
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public Long getConversation() {
        return conversation;
    }

    public void setConversation(Long conversation) {
        this.conversation = conversation;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public Timestamp getSentAt() {
        return sentAt;
    }

    public void setSentAt(Timestamp sentAt) {
        this.sentAt = sentAt;
    }
}
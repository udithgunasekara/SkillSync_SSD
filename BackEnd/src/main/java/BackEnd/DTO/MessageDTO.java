package BackEnd.DTO;

import jakarta.persistence.Column;

import java.sql.Timestamp;

public class MessageDTO {
    private Long messageId;
    private String sender;
    private String receiver;
    private Long conversation;
    private String messageText;
    private Timestamp sentAt;

    public MessageDTO(Long messageId, String sender, String receiver, Long conversation, String messageText, Timestamp sentAt) {
        this.messageId = messageId;
        this.sender = sender;
        this.receiver = receiver;
        this.conversation = conversation;
        this.messageText = messageText;
        this.sentAt = sentAt;
    }

    public MessageDTO() {
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
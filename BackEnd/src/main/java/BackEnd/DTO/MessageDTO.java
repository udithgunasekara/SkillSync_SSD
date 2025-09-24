package BackEnd.DTO;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.Length;

import java.sql.Timestamp;

public class MessageDTO {
    private Long messageId;
    
    @NotBlank(message = "Sender cannot be blank")
    @Size(min = 3, max = 50, message = "Sender must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Sender can only contain alphanumeric characters, dots, underscores, and hyphens")
    private String sender;
    
    @NotBlank(message = "Receiver cannot be blank")
    @Size(min = 3, max = 50, message = "Receiver must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Receiver can only contain alphanumeric characters, dots, underscores, and hyphens")
    private String receiver;
    
    @NotNull(message = "Conversation ID cannot be null")
    @Positive(message = "Conversation ID must be positive")
    private Long conversation;
    
    @NotBlank(message = "Message text cannot be blank")
    @Size(max = 1000, message = "Message text cannot exceed 1000 characters")
    @Pattern(regexp = "^[^<>\"'&]*$", message = "Message text contains invalid characters")
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
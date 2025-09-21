package BackEnd.DTO;

import java.sql.Date;

public class ConversationDTO {
    private Long conversationId;
    private String user1;
    private String user2;
    private Date startedAt;

    public ConversationDTO(Long conversationId, String user1, String user2, Date startedAt) {
        this.conversationId = conversationId;
        this.user1 = user1;
        this.user2 = user2;
        this.startedAt = startedAt;
    }

    public ConversationDTO() {
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
package BackEnd.DTO;

public class InboxDTO {

    private Long inboxId;
    private String username;
    private String user2;
    private Long conversationId;
    private String message;
    private Boolean isRead;
    private Boolean isArchived;


    public InboxDTO(Long inboxId,String username, String user2, Long conversationId, String message, Boolean isRead, Boolean isArchived) {
        this.inboxId=inboxId;
        this.username = username;
        this.user2 = user2;
        this.conversationId = conversationId;
        this.message = message;
        this.isRead = isRead;
        this.isArchived = isArchived;
    }

    public InboxDTO() {
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
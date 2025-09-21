package BackEnd.Mapper;

import BackEnd.DTO.InboxDTO;
import BackEnd.entity.Inbox;

public class InboxMapper {
    public static InboxDTO mapToInboxDTO(Inbox inbox){
        return new InboxDTO(
                inbox.getInboxId(),
                inbox.getUsername(),
                inbox.getUser2(),
                inbox.getConversationId(),
                inbox.getMessage(),
                inbox.getRead(),
                inbox.getArchived()
        );
    }
    public static Inbox mapToInbox(InboxDTO inboxDTO){
        return new Inbox(
                inboxDTO.getInboxId(),
                inboxDTO.getUsername(),
                inboxDTO.getUser2(),
                inboxDTO.getConversationId(),
                inboxDTO.getMessage(),
                inboxDTO.getRead(),
                inboxDTO.getArchived()
        );
    }
}
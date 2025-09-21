package BackEnd.service;

import BackEnd.DTO.InboxDTO;
import BackEnd.entity.Inbox;

import java.util.List;

public interface InboxService {
    public List<InboxDTO> getAllInboxMessagesByUser(String username);

    public InboxDTO saveInboxMessage(Inbox inbox);


    public InboxDTO saveInboxMessageByConversationId(Long conversationId, String username, Inbox newInbox);



    InboxDTO changeIsRead(Long id, String username);

    List<InboxDTO> getAllInboxMessagesByconversationId(Long conversationId);
}
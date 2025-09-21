package BackEnd.service;

import BackEnd.DTO.ConversationDTO;
import BackEnd.entity.Conversation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

public interface ConversationService {

    public List<Conversation> getAllConversations();

    public ConversationDTO getConversationByUser1AndUser2(String user1, String user2);
    public ConversationDTO saveConversation(Conversation conversation);

}
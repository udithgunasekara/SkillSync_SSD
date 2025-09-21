package BackEnd.Mapper;

import BackEnd.DTO.ConversationDTO;
import BackEnd.entity.Conversation;

public class ConversationMapper {
    public static ConversationDTO mapToConversationDTO(Conversation conversation){
        return new ConversationDTO(
                conversation.getConversationId(),
                conversation.getUser1(),
                conversation.getUser2(),
                conversation.getStartedAt()
        );
    }
    public static Conversation mapToConversation(ConversationDTO conversationDTO){
        return new Conversation(
                conversationDTO.getConversationId(),
                conversationDTO.getUser1(),
                conversationDTO.getUser2(),
                conversationDTO.getStartedAt()
        );
    }
}
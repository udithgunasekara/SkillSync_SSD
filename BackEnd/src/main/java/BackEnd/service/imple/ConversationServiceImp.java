package BackEnd.service.imple;

import BackEnd.DTO.ConversationDTO;
import BackEnd.Mapper.ConversationMapper;
import BackEnd.entity.Conversation;
import BackEnd.repository.ConversationRepository;
import BackEnd.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConversationServiceImp implements ConversationService {
    private final ConversationRepository conversationRepository;

    @Autowired
    public ConversationServiceImp(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    @Override
    public List<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    @Override
    public ConversationDTO getConversationByUser1AndUser2(String user1, String user2) {
        Optional<Conversation> conversationOptional = conversationRepository.findByUser1AndUser2(user1, user2);
        if (conversationOptional.isPresent()) {
            return ConversationMapper.mapToConversationDTO(conversationOptional.get());
        } else {
            return null;
        }
    }

    @Override
    public ConversationDTO saveConversation(Conversation conversation) {
        Conversation conversation1=conversationRepository.save(conversation);
        return ConversationMapper.mapToConversationDTO(conversation1);
    }

}
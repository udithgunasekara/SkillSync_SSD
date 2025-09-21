package BackEnd.service.imple;

import BackEnd.DTO.MessageDTO;
import BackEnd.Mapper.MessageMapper;
import BackEnd.entity.Message;
import BackEnd.repository.MessageRepository;
import BackEnd.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class MessageServiceImp implements MessageService {
    private final MessageRepository messageRepository;

    @Autowired
    public MessageServiceImp(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    @Override
    public List<Message> getMessageByConversation(Long conversation) {
        return messageRepository.findByConversation(conversation);
    }

    @Override
    public MessageDTO saveMessage(Message message) {
        Message message1=messageRepository.save(message);
        return MessageMapper.mapToMessageDTO(message1);
    }

    @Override
    public MessageDTO findLatestMessageByConversationId(Long conversation) {
        Message message=messageRepository.findLatestMessageByConversationId(conversation).orElseThrow(() -> new RuntimeException("Message not found with id : " + conversation));
        return MessageMapper.mapToMessageDTO(message);
    }

    @Override
    public Optional<Message> updateMessage(Long id, Message updatedMessage) {
        return messageRepository.findById(id).map(existingMessage -> {
            existingMessage.setMessageText(updatedMessage.getMessageText());
            existingMessage.setSender(updatedMessage.getSender());
            existingMessage.setReceiver(updatedMessage.getReceiver());
            existingMessage.setConversation(updatedMessage.getConversation());
            existingMessage.setSentAt(updatedMessage.getSentAt());
            return messageRepository.save(existingMessage);
        });
    }

    @Override
    public void deleteMessage(Long id) {
        Message message=messageRepository.findById(id).
                orElseThrow(() -> new RuntimeException("Message not found with id : " + id));
        messageRepository.delete(message);
    }
}

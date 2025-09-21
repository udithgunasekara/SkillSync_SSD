package BackEnd.service;

import BackEnd.DTO.MessageDTO;
import BackEnd.entity.Message;

import java.util.List;
import java.util.Optional;

public interface MessageService {
    public List<Message> getAllMessages();

    public List<Message> getMessageByConversation(Long conversation);

    public MessageDTO saveMessage(Message message);

    public MessageDTO findLatestMessageByConversationId(Long conversation);

    public Optional<Message> updateMessage(Long id, Message updatedMessage);


    public void deleteMessage(Long id);
}
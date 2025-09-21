package BackEnd.Mapper;

import BackEnd.DTO.MessageDTO;
import BackEnd.entity.Message;

public class MessageMapper {
    public static MessageDTO mapToMessageDTO(Message message){
        return new MessageDTO(
                message.getMessageId(),
                message.getSender(),
                message.getReceiver(),
                message.getMessageId(),
                message.getMessageText(),
                message.getSentAt()
        );
    }

    public static Message mapToMessage(MessageDTO messageDTO){
        return new Message(
                messageDTO.getMessageId(),
                messageDTO.getSender(),
                messageDTO.getReceiver(),
                messageDTO.getMessageId(),
                messageDTO.getMessageText(),
                messageDTO.getSentAt()
        );
    }
}
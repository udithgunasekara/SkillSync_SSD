package BackEnd.service.imple;

import BackEnd.DTO.InboxDTO;
import BackEnd.Mapper.InboxMapper;
import BackEnd.entity.Inbox;
import BackEnd.repository.InboxRepository;
import BackEnd.service.InboxService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InboxServiceImp implements InboxService {

    private final InboxRepository inboxRepository;

    @Autowired
    public InboxServiceImp(InboxRepository inboxRepository) {
        this.inboxRepository = inboxRepository;
    }

    @Override
    public List<InboxDTO> getAllInboxMessagesByUser(String username) {
        List<Inbox> inbox = inboxRepository.findByusername(username);
        return inbox.stream().map(InboxMapper::mapToInboxDTO).collect(Collectors.toList());
    }

    @Override
    public InboxDTO saveInboxMessage(Inbox inbox) {
        Inbox inbox1=inboxRepository.save(inbox);
        return InboxMapper.mapToInboxDTO(inbox1);
    }


    @Override
    public InboxDTO saveInboxMessageByConversationId(Long conversationId, String username, Inbox newInbox) {
        Inbox existingInbox = inboxRepository.findByConversationIdAndUsername(conversationId, username);

        if (existingInbox == null) {

            throw new EntityNotFoundException("Inbox not found for conversation ID: " + conversationId + " and username: " + username);
        }


        existingInbox.setMessage(newInbox.getMessage());
        existingInbox.setRead(newInbox.getRead());

        Inbox savedInbox = inboxRepository.save(existingInbox);

        return InboxMapper.mapToInboxDTO(savedInbox);
    }


    @Override
    public InboxDTO changeIsRead(Long id, String username) {
        int updatedCount = inboxRepository.markAsRead(id,username);
        if (updatedCount > 0) {
            Inbox inbox = inboxRepository.findByConversationIdAndUsername(id, username);
            return InboxMapper.mapToInboxDTO(inbox);

        }
        return null;
    }

    @Override
    public List<InboxDTO> getAllInboxMessagesByconversationId(Long conversationId) {
        List<Inbox> inbox = inboxRepository.findByconversationId(conversationId);
        return inbox.stream().map(InboxMapper::mapToInboxDTO).collect(Collectors.toList());
    }
}

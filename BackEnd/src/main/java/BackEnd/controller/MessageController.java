package BackEnd.controller;

import BackEnd.DTO.MessageDTO;
import BackEnd.entity.Message;
import BackEnd.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageService.getAllMessages();
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @GetMapping("/latest/{conversation}") // Different endpoint mapping
    public MessageDTO findLatestMessageByConversationId(@PathVariable Long conversation) {
        return messageService.findLatestMessageByConversationId(conversation);
    }
    @GetMapping("/{conversation}")
    public ResponseEntity<List<Message>> getMessageByConversation(@PathVariable Long conversation) {
        List<Message> messages = messageService.getMessageByConversation(conversation);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity<MessageDTO> createMessage(@RequestBody Message message) {
        MessageDTO createdMessage = messageService.saveMessage(message);
        return new ResponseEntity<>(createdMessage, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Message> updateMessage(@PathVariable Long id, @RequestBody Message updatedMessage) {
        Optional<Message> updated = messageService.updateMessage(id, updatedMessage);
        return updated.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
    }
}
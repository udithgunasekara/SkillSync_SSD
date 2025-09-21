package BackEnd.controller;

import BackEnd.DTO.ConversationDTO;
import BackEnd.entity.Conversation;
import BackEnd.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    @Autowired
    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping
    public ResponseEntity<List<Conversation>> getAllConversations() {
        List<Conversation> conversations = conversationService.getAllConversations();
        return new ResponseEntity<>(conversations, HttpStatus.OK);
    }


    @GetMapping("/{username}/{user2Username}")
    public ConversationDTO getConversationByUser1AndUser2(@PathVariable String username, @PathVariable String user2Username) {
        return conversationService.getConversationByUser1AndUser2(username, user2Username);
    }

    @PostMapping
    public ResponseEntity<ConversationDTO> createConversation(@RequestBody Conversation conversation) {
        ConversationDTO savedConversation = conversationService.saveConversation(conversation);
        return new ResponseEntity<ConversationDTO>(savedConversation, HttpStatus.CREATED);
    }
}
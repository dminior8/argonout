package pl.dminior.backend_argonout.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.dminior.backend_argonout.dto.CurrentUserMessageDTO;
import pl.dminior.backend_argonout.dto.UserMessageDTO;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.security.payloads.response.MessageResponse;
import pl.dminior.backend_argonout.service.MessageService;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @PostMapping("/messages/send")
    public ResponseEntity<MessageResponse> sendFeedbackMessageByCurrentUser(
            @RequestBody CurrentUserMessageDTO currentUserMessageDTO) throws UserAuthenticationException {

        messageService.sendFeedbackMessageByCurrentUser(currentUserMessageDTO);
        return new ResponseEntity<>(new MessageResponse("Message sent correctly"), HttpStatus.OK);
    }

    @GetMapping("/messages/get/all")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Page<UserMessageDTO> getAllMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){

        Pageable pageable = PageRequest.of(page, size);
        return messageService.getAllMessages(pageable);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/messages/{messageId}/delete")
    public ResponseEntity<MessageResponse> deleteMessage(@PathVariable UUID messageId) {
        if(messageService.deleteMessageById(messageId)){
            return new ResponseEntity<>(new MessageResponse("Message deleted"), HttpStatus.OK);
        }
        return new ResponseEntity<>(new MessageResponse("Message not found"), HttpStatus.NOT_FOUND);
    }
}

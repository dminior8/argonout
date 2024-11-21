package pl.dminior.backend_argonout.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pl.dminior.backend_argonout.dto.CurrentUserMessageDTO;
import pl.dminior.backend_argonout.dto.UserMessageDTO;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.mapper.MessageMapper;
import pl.dminior.backend_argonout.model.Message;
import pl.dminior.backend_argonout.repository.MessageRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {
    private final UserService userService;
    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;

    @Override
    @Transactional
    public void sendFeedbackMessageByCurrentUser(CurrentUserMessageDTO message) throws UserAuthenticationException {
        Message mainMessage = new Message();
        mainMessage.setTopic(message.getTopic());
        mainMessage.setContent(message.getContent());
        mainMessage.setCreatedAt(LocalDateTime.now());
        mainMessage.setSenderId(userService.getCurrentUser().getId());

        messageRepository.save(mainMessage);
    }

    @Override
    public Page<UserMessageDTO> getAllMessages(Pageable pageable){
        Page<Message> messages = messageRepository.findAll(pageable);

        return messages.map(messageMapper::mapToUserMessageDTO);
    }

    @Override
    public boolean deleteMessageById(UUID messageId){
        if(messageRepository.findMessageById(messageId) != null){
            messageRepository.deleteById(messageId);
            return true;
        }
        return false;
    }
}

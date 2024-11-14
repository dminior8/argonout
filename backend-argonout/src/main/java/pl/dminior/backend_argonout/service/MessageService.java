package pl.dminior.backend_argonout.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.dminior.backend_argonout.dto.CurrentUserMessageDTO;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.model.Message;

import java.util.UUID;

public interface MessageService {
    void sendFeedbackMessageByCurrentUser(CurrentUserMessageDTO currentUserMessageDTO) throws UserAuthenticationException;

    Page<Message> getAllMessages(Pageable pageable);

    boolean deleteMessageById(UUID messageId);
}

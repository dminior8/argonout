package pl.dminior.backend_argonout.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.dminior.backend_argonout.dto.CurrentUserMessageDTO;
import pl.dminior.backend_argonout.dto.UserMessageDTO;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;

import java.util.UUID;

public interface MessageService {
    void sendFeedbackMessageByCurrentUser(CurrentUserMessageDTO currentUserMessageDTO) throws UserAuthenticationException;

    Page<UserMessageDTO> getAllMessages(Pageable pageable);

    boolean deleteMessageById(UUID messageId);
}

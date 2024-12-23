package pl.dminior.backend_argonout.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.dminior.backend_argonout.dto.CurrentUserMessageDTO;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.model.Message;
import pl.dminior.backend_argonout.model.User;
import pl.dminior.backend_argonout.repository.MessageRepository;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.Mockito.*;

class MessageServiceImplTest {

    @Mock
    private UserService userService;

    @Mock
    private MessageRepository messageRepository;

    @InjectMocks
    private MessageServiceImpl messageService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void sendFeedbackMessageByCurrentUser_shouldSaveMessage() throws UserAuthenticationException {
        // Arrange
        User currentUser = new User();
        currentUser.setId(UUID.randomUUID());
        when(userService.getCurrentUser()).thenReturn(currentUser);

        CurrentUserMessageDTO messageDTO =
                new CurrentUserMessageDTO("Feedback", "This is a feedback message");

        // Act
        messageService.sendFeedbackMessageByCurrentUser(messageDTO);

        // Assert
        verify(userService).getCurrentUser();
        verify(messageRepository).save(argThat(savedMessage ->
                savedMessage.getTopic().equals("Feedback") &&
                        savedMessage.getContent().equals("This is a feedback message") &&
                        savedMessage.getSenderId().equals(currentUser.getId()) &&
                        savedMessage.getCreatedAt() != null
        ));
    }
}

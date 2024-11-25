package pl.dminior.backend_argonout.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.dminior.backend_argonout.dto.UserMessageDTO;
import pl.dminior.backend_argonout.model.Message;
import pl.dminior.backend_argonout.service.UserService;

@Component
@RequiredArgsConstructor
public class MessageMapper {
    private final UserService userService;

    public UserMessageDTO mapToUserMessageDTO(Message message) {
        UserMessageDTO dto = new UserMessageDTO();
        dto.setId(message.getId());
        dto.setTopic(message.getTopic());
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setSenderId(message.getSenderId());

        var user = userService.findUserById(message.getSenderId());
        dto.setSenderUsername(user.getUsername());
        dto.setSenderEmail(user.getEmail());

        return dto;
    }
}

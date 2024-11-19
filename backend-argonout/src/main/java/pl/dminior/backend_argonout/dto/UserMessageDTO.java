package pl.dminior.backend_argonout.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class UserMessageDTO {
    private UUID id;

    private String topic;

    private String content;

    private LocalDateTime createdAt;

    private UUID senderId;

    private String senderUsername;

    private String senderEmail;
}

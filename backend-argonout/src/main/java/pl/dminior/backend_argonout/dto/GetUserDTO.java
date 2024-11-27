package pl.dminior.backend_argonout.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import pl.dminior.backend_argonout.model.ERole;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class GetUserDTO {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String surname;
    private ERole role;
    private Integer points;
    private LocalDateTime createdAt;

}


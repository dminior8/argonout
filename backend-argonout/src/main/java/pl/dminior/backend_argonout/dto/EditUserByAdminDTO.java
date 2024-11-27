package pl.dminior.backend_argonout.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import pl.dminior.backend_argonout.model.ERole;
import pl.dminior.backend_argonout.model.EStatus;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class EditUserByAdminDTO {
    private UUID userId;

    private String username;

    private String email;

    private String firstName;

    private String surname;

    private ERole role;

    private Integer points;

    private EStatus status;
}

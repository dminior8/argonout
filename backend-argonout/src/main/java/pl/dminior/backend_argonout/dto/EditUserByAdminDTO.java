package pl.dminior.backend_argonout.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import pl.dminior.backend_argonout.model.ERole;
import pl.dminior.backend_argonout.model.EStatus;

@Getter
@Setter
@AllArgsConstructor
public class EditUserByAdminDTO {
    private ERole role;

    private Integer points;

    private EStatus status;

}

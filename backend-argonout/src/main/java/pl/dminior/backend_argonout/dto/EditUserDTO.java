package pl.dminior.backend_argonout.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EditUserDTO {
    private String username;

    private String email;

    private String password;

    private String firstName;

    private String surname;
}

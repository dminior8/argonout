package pl.dminior.backend_argonout.payloads.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    @Email
    private String username;

    @NotBlank
    @Size(min = 4, max = 100)
    @Email
    private String email;


    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String surname;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}


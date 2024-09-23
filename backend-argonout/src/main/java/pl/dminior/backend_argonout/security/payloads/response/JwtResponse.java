package pl.dminior.backend_argonout.security.payloads.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import pl.dminior.backend_argonout.model.ERole;

import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private UUID id;
    private String username;
    private ERole role;

    public JwtResponse(String accessToken, UUID id, String username, ERole role) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.role = role;
    }
}
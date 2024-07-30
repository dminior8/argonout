package pl.dminior.backend_argonout.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.dminior.backend_argonout.payloads.request.LoginRequest;
import pl.dminior.backend_argonout.payloads.response.JwtResponse;
import pl.dminior.backend_argonout.security.services.LoginServiceImpl;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final LoginServiceImpl loginServiceImpl;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        return loginServiceImpl.getJwtResponseResponseEntity(loginRequest);
    }
}

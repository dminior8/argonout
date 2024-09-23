package pl.dminior.backend_argonout.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.security.payloads.request.LoginRequest;
import pl.dminior.backend_argonout.security.payloads.request.RegisterRequest;
import pl.dminior.backend_argonout.security.payloads.response.JwtResponse;
import pl.dminior.backend_argonout.security.payloads.response.MessageResponse;
import pl.dminior.backend_argonout.service.LoginServiceImpl;
import pl.dminior.backend_argonout.service.UserServiceImpl;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class LoginController {
    private final LoginServiceImpl loginServiceImpl;

    private final UserServiceImpl userServiceImpl;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        return loginServiceImpl.getJwtResponseResponseEntity(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {

        try{
            userServiceImpl.registerUser(registerRequest);
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse("Email or Username is already in use"));
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logoutUser(@CookieValue(name = "accessToken", required = false) String refreshToken) {
        if (refreshToken != null) {
            new HttpHeaders().add(HttpHeaders.SET_COOKIE, String.valueOf(loginServiceImpl.createAccessTokenCookie("", 0L)));

            return ResponseEntity.ok().body(new MessageResponse("Log out successful"));
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new MessageResponse("No active session to log out from"));
    }
}


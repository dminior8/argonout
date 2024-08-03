package pl.dminior.backend_argonout.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.dminior.backend_argonout.model.User;
import pl.dminior.backend_argonout.payloads.request.LoginRequest;
import pl.dminior.backend_argonout.payloads.request.RegisterRequest;
import pl.dminior.backend_argonout.payloads.response.JwtResponse;
import pl.dminior.backend_argonout.payloads.response.MessageResponse;
import pl.dminior.backend_argonout.security.services.LoginServiceImpl;
import pl.dminior.backend_argonout.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final LoginServiceImpl loginServiceImpl;

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        return loginServiceImpl.getJwtResponseResponseEntity(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
//        RegisterRequest request = RegisterRequest.builder()
//                .username(registerRequest.getUsername())
//                .email(registerRequest.getEmail())
//                .firstName(registerRequest.getFirstName())
//                .surname(registerRequest.getSurname())
//                .password(registerRequest.getPassword())
//                .build();

        try{
            userService.registerUser(registerRequest);
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse("Email or Username is already in use"));
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}

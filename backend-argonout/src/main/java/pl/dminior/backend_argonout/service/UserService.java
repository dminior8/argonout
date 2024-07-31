package pl.dminior.backend_argonout.service;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.model.ERole;
import pl.dminior.backend_argonout.model.User;
import pl.dminior.backend_argonout.payloads.response.MessageResponse;
import pl.dminior.backend_argonout.payloads.response.UserResponse;
import pl.dminior.backend_argonout.repository.UserRepository;
import pl.dminior.backend_argonout.payloads.request.RegisterRequest;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public UserService(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public void registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail()) ||
                userRepository.existsByUsername(registerRequest.getEmail())) {
            throw new IllegalArgumentException();
        }

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .surname(registerRequest.getSurname())
                .email(registerRequest.getEmail())
                .username(registerRequest.getUsername())
                .password(encoder.encode(registerRequest.getPassword()))
                .role(ERole.USER)
                .points(0)
                .build();

        userRepository.save(user);
    }

    public UserResponse getDataAboutUser(String username) throws UserAuthenticationException {
        User user = userRepository.findByUsername(username);

        // Przykładowe dane osiągnięć, powinny być dostosowane do rzeczywistej struktury danych
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getSurname(),
                user.getRole(),
                user.getPoints(),
                user.getCreatedAt());
    }
}

package pl.dminior.backend_argonout.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.dminior.backend_argonout.model.ERole;
import pl.dminior.backend_argonout.model.User;
import pl.dminior.backend_argonout.repository.UserRepository;
import pl.dminior.backend_argonout.payloads.request.RegisterRequest;

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
}

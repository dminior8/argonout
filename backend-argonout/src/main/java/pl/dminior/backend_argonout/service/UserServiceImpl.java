package pl.dminior.backend_argonout.service;

import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.model.ERole;
import pl.dminior.backend_argonout.model.User;
import pl.dminior.backend_argonout.security.payloads.response.UserResponse;
import pl.dminior.backend_argonout.repository.UserRepository;
import pl.dminior.backend_argonout.security.payloads.request.RegisterRequest;
import pl.dminior.backend_argonout.dto.EditUserDTO;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder encoder, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail()) ||
                userRepository.existsByUsername(registerRequest.getUsername())) {
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
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
    }

    public UserResponse getDataAboutUser(String username) throws UserAuthenticationException {
        Optional<User> user = userRepository.findByUsername(username);

        return user.map(value -> new UserResponse(
                value.getId(),
                value.getUsername(),
                value.getEmail(),
                value.getFirstName(),
                value.getSurname(),
                value.getRole(),
                value.getPoints(),
                value.getCreatedAt())).orElse(null);

    }
    @Transactional
    public UserResponse editDataAboutUser(String username, EditUserDTO editUserDTO) throws UserAuthenticationException {
        Optional<User> existingUser = userRepository.findByUsername(username);

        if (existingUser.isPresent()) {
            User userToUpdate = existingUser.get();

            userToUpdate.setUsername(editUserDTO.getUsername());
            userToUpdate.setEmail(editUserDTO.getEmail());
            userToUpdate.setFirstName(editUserDTO.getFirstName());
            userToUpdate.setSurname(editUserDTO.getSurname());

            userToUpdate.setPassword(passwordEncoder.encode(editUserDTO.getPassword()));

            userRepository.save(userToUpdate);

            return new UserResponse(
                    userToUpdate.getId(),
                    userToUpdate.getUsername(),
                    userToUpdate.getEmail(),
                    userToUpdate.getFirstName(),
                    userToUpdate.getSurname(),
                    userToUpdate.getRole(),
                    existingUser.get().getPoints(),
                    existingUser.get().getCreatedAt());

        }
        return null;
    }

    @Transactional
    public Boolean deleteCurrentUser(String username) throws UserAuthenticationException {
        Optional<User> existingUser = userRepository.findByUsername(username);

        if (existingUser.isPresent()) {
            userRepository.deleteByUsername(username);
            return true;
        }
        return false;

    }
}

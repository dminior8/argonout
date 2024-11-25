package pl.dminior.backend_argonout.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.dminior.backend_argonout.dto.EditUserByAdminDTO;
import pl.dminior.backend_argonout.dto.GetUserByAdminDTO;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.mapper.UserMapper;
import pl.dminior.backend_argonout.model.ERole;
import pl.dminior.backend_argonout.model.EStatus;
import pl.dminior.backend_argonout.model.User;
import pl.dminior.backend_argonout.dto.GetUserDTO;
import pl.dminior.backend_argonout.repository.UserRepository;
import pl.dminior.backend_argonout.security.payloads.request.RegisterRequest;
import pl.dminior.backend_argonout.dto.EditUserDTO;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder encoder;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

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

    public GetUserDTO getDataAboutUser(String username) throws UserAuthenticationException {
        Optional<User> user = userRepository.findByUsername(username);

        return user.map(value -> new GetUserDTO(
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
    public GetUserDTO editDataAboutUser(String username, EditUserDTO editUserDTO) throws UserAuthenticationException {
        Optional<User> existingUser = userRepository.findByUsername(username);

        if (existingUser.isPresent()) {
            User userToUpdate = existingUser.get();

            userToUpdate.setUsername(editUserDTO.getUsername());
            userToUpdate.setEmail(editUserDTO.getEmail());
            userToUpdate.setFirstName(editUserDTO.getFirstName());
            userToUpdate.setSurname(editUserDTO.getSurname());

            if(editUserDTO.getPassword() != null){
                userToUpdate.setPassword(passwordEncoder.encode(editUserDTO.getPassword()));
            }

            userRepository.save(userToUpdate);

            return new GetUserDTO(
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
    @Override
    public Boolean deleteCurrentUser(String username) throws UserAuthenticationException {
        Optional<User> existingUser = userRepository.findByUsername(username);

        if (existingUser.isPresent()) {
            userRepository.deleteByUsername(username);
            return true;
        }
        return false;

    }

    @Override
    public User getCurrentUser() throws UserAuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username).orElse(null);
    }

    @Override
    public User findUserById(UUID id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public Page<GetUserByAdminDTO> getAllUsers(Pageable pageable) {

        return userRepository.findAll(pageable).map(userMapper::getUserByAdminDTO);
    }

    @Override
    public GetUserByAdminDTO getUserById(UUID userId){
        Optional<User> user = userRepository.findById(userId);

        return user.map(userMapper::getUserByAdminDTO).orElse(null);
    }

    @Override
    @Transactional
    public boolean editUserById(UUID userId, EditUserByAdminDTO userDTO){
        Optional<User> existingUser = userRepository.findById(userId);

        if (existingUser.isPresent()) {
            User userToUpdate = existingUser.get();

            if(userDTO.getPoints() != null){
                userToUpdate.setPoints(userDTO.getPoints());
            }
            if(userDTO.getRole() != null){
                userToUpdate.setRole(userDTO.getRole());
            }
            if(userDTO.getStatus() != null && userDTO.getStatus() != EStatus.DELETED){
                userToUpdate.setStatus(userDTO.getStatus());
            }

            userRepository.save(userToUpdate);
            return true;
        }
        return false;
    }

    @Override
    public boolean deleteUserById(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            user.setUsername(null);
            user.setEmail(null);
            user.setPassword(null);
            user.setFirstName(null);
            user.setSurname(null);
            user.setPoints(0);
            user.setStatus(EStatus.DELETED);

            userRepository.save(user);
            return true;
        }
        return false;
    }

}

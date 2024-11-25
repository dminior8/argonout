package pl.dminior.backend_argonout.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.dminior.backend_argonout.dto.EditUserByAdminDTO;
import pl.dminior.backend_argonout.dto.GetUserByAdminDTO;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.model.User;
import pl.dminior.backend_argonout.dto.GetUserDTO;
import pl.dminior.backend_argonout.security.payloads.request.RegisterRequest;
import pl.dminior.backend_argonout.dto.EditUserDTO;

import java.util.UUID;

public interface UserService {

    void registerUser(RegisterRequest registerRequest);

    GetUserDTO getDataAboutUser(String username) throws UserAuthenticationException;

    GetUserDTO editDataAboutUser(String username, EditUserDTO editUserDTO) throws UserAuthenticationException;

    Boolean deleteCurrentUser(String username) throws UserAuthenticationException;

    User getCurrentUser() throws UserAuthenticationException;

    User findUserById(UUID senderId);

    GetUserByAdminDTO getUserById(UUID userId);

    Page<GetUserByAdminDTO> getAllUsers(Pageable pageable);

    boolean editUserById(UUID userId, EditUserByAdminDTO userDTO);

    boolean deleteUserById(UUID userId);
}

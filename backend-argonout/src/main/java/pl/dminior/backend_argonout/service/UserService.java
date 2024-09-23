package pl.dminior.backend_argonout.service;

import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.security.payloads.response.UserResponse;
import pl.dminior.backend_argonout.security.payloads.request.RegisterRequest;
import pl.dminior.backend_argonout.dto.EditUserDTO;

public interface UserService {

    void registerUser(RegisterRequest registerRequest);

    UserResponse getDataAboutUser(String username) throws UserAuthenticationException;

    UserResponse editDataAboutUser(String username, EditUserDTO editUserDTO) throws UserAuthenticationException;

    Boolean deleteCurrentUser(String username) throws UserAuthenticationException;
}

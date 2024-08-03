package pl.dminior.backend_argonout.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pl.dminior.backend_argonout.dto.EditUserDTO;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.model.User;
import pl.dminior.backend_argonout.payloads.request.RegisterRequest;
import pl.dminior.backend_argonout.payloads.response.MessageResponse;
import pl.dminior.backend_argonout.payloads.response.UserResponse;
import pl.dminior.backend_argonout.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/me")
public class UserController {

    private final UserService userService;

    //Pobranie informacji o zalogowanym użytkowniku
    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserResponse> getDataAboutUser() throws UserAuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return ResponseEntity.ok(userService.getDataAboutUser(username));
    }


    //Aktualizuje informacje o zalogowanym użytkowniku
    @PutMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserResponse> editDataAboutUser(@RequestBody EditUserDTO editUserDTO) throws UserAuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return ResponseEntity.ok(userService.editDataAboutUser(username, editUserDTO));
    }



      //Usuwa konto zalogowanego użytkownika
//    @DeleteMapping
//    public ResponseEntity<MessageResponse> deleteCurrentUser() {}

      //Pobranie osiągnięć zalogowanego użytkownika
//    @GetMapping("/achievements")
//    public ResponseEntity<MessageResponse> getUserAchivements() {}


}

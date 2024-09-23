package pl.dminior.backend_argonout.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pl.dminior.backend_argonout.dto.EditUserDTO;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.security.payloads.response.MessageResponse;
import pl.dminior.backend_argonout.security.payloads.response.UserResponse;
import pl.dminior.backend_argonout.service.UserServiceImpl;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users/me")
public class UserController {

    private final UserServiceImpl userServiceImpl;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserResponse> getDataAboutUser() throws UserAuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return ResponseEntity.ok(userServiceImpl.getDataAboutUser(username));
    }

    @PutMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> editDataAboutUser(@RequestBody EditUserDTO editUserDTO) throws UserAuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        if(userServiceImpl.editDataAboutUser(username, editUserDTO) != null){
            return ResponseEntity.ok(new MessageResponse("Account edited successfully"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error during account editing"));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteCurrentUser() throws UserAuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();


        if(userServiceImpl.deleteCurrentUser(username)){
            return ResponseEntity.ok(new MessageResponse("Account successfully deleted."));
        }

        return ResponseEntity.status(404).body(new MessageResponse("Wrong username.")) ;
    }

      //Pobranie osiągnięć zalogowanego użytkownika
//    @GetMapping("/achievements")
//    public ResponseEntity<MessageResponse> getUserAchivements() {}


}

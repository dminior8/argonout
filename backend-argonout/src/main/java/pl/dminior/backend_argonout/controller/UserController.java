package pl.dminior.backend_argonout.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pl.dminior.backend_argonout.dto.EditUserByAdminDTO;
import pl.dminior.backend_argonout.dto.EditUserDTO;
import pl.dminior.backend_argonout.dto.GetUserByAdminDTO;
import pl.dminior.backend_argonout.exception.UserAuthenticationException;
import pl.dminior.backend_argonout.security.payloads.response.MessageResponse;
import pl.dminior.backend_argonout.dto.GetUserDTO;
import pl.dminior.backend_argonout.service.MessageServiceImpl;
import pl.dminior.backend_argonout.service.UserService;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final MessageServiceImpl messageServiceImpl;

    @GetMapping("/me")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<GetUserDTO> getCurrentUser() throws UserAuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return ResponseEntity.ok(userService.getDataAboutUser(username));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> editCurrentUser(@RequestBody EditUserDTO editUserDTO) throws UserAuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        if(userService.editDataAboutUser(username, editUserDTO) != null){
            return ResponseEntity.ok(new MessageResponse("Account edited successfully"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error during account editing"));
    }

    @DeleteMapping("/me")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteCurrentUser() throws UserAuthenticationException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();


        if(userService.deleteCurrentUser(username)){
            return ResponseEntity.ok(new MessageResponse("Account successfully deleted."));
        }

        return ResponseEntity.status(404).body(new MessageResponse("Wrong username.")) ;
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<GetUserByAdminDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.asc("username")));
        return ResponseEntity.ok().body(userService.getAllUsers(pageable));
    }


    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<GetUserByAdminDTO> getUserById(@PathVariable UUID userId) throws UserAuthenticationException {
        GetUserByAdminDTO user = userService.getUserById(userId);
        if(user != null){
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    @PatchMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> editUserById(@PathVariable UUID userId, @RequestBody EditUserByAdminDTO userDTO) throws UserAuthenticationException {
        if(userService.editUserById(userId, userDTO)){
            return ResponseEntity.ok(new MessageResponse("Account edited successfully"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error during account editing"));
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> deleteUserById(@PathVariable UUID userId){
        if(userService.deleteUserById(userId)){
            return ResponseEntity.ok(new MessageResponse("Account successfully deleted"));
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Wrong user ID"));
    }
}

package pl.dminior.backend_argonout.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;

import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.dminior.backend_argonout.dto.GetUserDTO;
import pl.dminior.backend_argonout.model.ERole;
import pl.dminior.backend_argonout.model.User;
import pl.dminior.backend_argonout.repository.UserRepository;
import pl.dminior.backend_argonout.security.payloads.request.RegisterRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
    //mock nie ma rzeczywistej implementacji, wszystkie wywołania jego metod
    //zwracają wartości domyślne, dopóki nie skonfiguruje się inaczej (when)
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder encoder;

    private UserServiceImpl userService;

    private RegisterRequest registerRequest;

    @BeforeEach
    public void setUp() {
        userService = new UserServiceImpl(userRepository, null, encoder);

        registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setUsername("testuser");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("John");
        registerRequest.setSurname("Doe");
    }

    @Test
    public void shouldThrowExceptionWhenUserAlreadyExists() {
        //given

        //symuluje, że getEmail zwraca true
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        //when + then
        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(registerRequest));

        //metoda weryfikująca, że save nie zosatło wywołane ani raz
        //never to atrybut weryfikacji, inne to np. times(n), atLeast(n), czy atMost(n).
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void shouldRegisterUserWhenDataIsValid() {
        //given
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(false);
        when(encoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword"); //symulacja haszowania

        //when
        userService.registerUser(registerRequest);

        //then

        //obiekt przechwycający argumenty przekazane do metody mocka
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture()); //przechwycenie

        User savedUser = userCaptor.getValue();
        assertNotNull(savedUser);
        assertEquals(registerRequest.getEmail(), savedUser.getEmail());
        assertEquals(registerRequest.getUsername(), savedUser.getUsername());
        assertEquals("encodedPassword", savedUser.getPassword());
        assertEquals(registerRequest.getFirstName(), savedUser.getFirstName());
        assertEquals(registerRequest.getSurname(), savedUser.getSurname());
        assertEquals(ERole.USER, savedUser.getRole());
        assertEquals(0, savedUser.getPoints());
        assertNotNull(savedUser.getCreatedAt());
    }

    @Test
    void getDataAboutUser() throws Exception {
        // given: symulacja użytkownika w bazie danych
        UUID id = UUID.randomUUID();
        User mockUser = new User();
        mockUser.setId(id);
        mockUser.setUsername("testuser");
        mockUser.setEmail("test@example.com");
        mockUser.setFirstName("John");
        mockUser.setSurname("Doe");
        mockUser.setRole(ERole.USER);
        mockUser.setPoints(100);
        mockUser.setCreatedAt(LocalDateTime.parse("2023-12-01T00:00:00"));

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));

        // when: wywołanie testowanej metody
        GetUserDTO result = userService.getDataAboutUser("testuser");

        // then: weryfikacja wyników
        assertNotNull(result);
        assertEquals(id, result.getId());
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getSurname());
        assertEquals(ERole.USER, result.getRole());
        assertEquals(100, result.getPoints());
        assertEquals(LocalDateTime.parse("2023-12-01T00:00:00"), result.getCreatedAt());

        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void getDataAboutUser_UserNotFound() throws Exception {
        // given: brak użytkownika w bazie danych
        when(userRepository.findByUsername("nonexistentuser")).thenReturn(Optional.empty());

        // when: wywołanie testowanej metody
        GetUserDTO result = userService.getDataAboutUser("nonexistentuser");

        // then: wynik powinien być null
        assertNull(result);

        verify(userRepository, times(1)).findByUsername("nonexistentuser");
    }

//    @Test
//    void editDataAboutUser() {
//    }
//
//    @Test
//    void deleteCurrentUser() {
//    }
//
//    @Test
//    void getCurrentUser() {
//    }
//
//    @Test
//    void findUserById() {
//    }
//
//    @Test
//    void getAllUsers() {
//    }
//
//    @Test
//    void getUserById() {
//    }
//
//    @Test
//    void editUserById() {
//    }
//
//    @Test
//    void deleteUserById() {
//    }
}
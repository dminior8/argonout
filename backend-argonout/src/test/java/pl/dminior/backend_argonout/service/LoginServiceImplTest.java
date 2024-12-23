package pl.dminior.backend_argonout.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import pl.dminior.backend_argonout.configuration.PropertiesConfig;
import pl.dminior.backend_argonout.model.ERole;
import pl.dminior.backend_argonout.security.jwt.JwtUtils;
import pl.dminior.backend_argonout.security.payloads.request.LoginRequest;
import pl.dminior.backend_argonout.security.payloads.response.JwtResponse;
import pl.dminior.backend_argonout.security.services.UserDetailsImpl;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LoginServiceImplTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private PropertiesConfig propertiesConfig;

    @InjectMocks
    private LoginServiceImpl loginService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void authenticateUser_shouldReturnJwtResponse_whenCredentialsAreValid() {
        // Arrange
        String username = "testUser";
        String password = "password";
        String jwtToken = "mockJwtToken";
        UUID userId = UUID.randomUUID();
        LoginRequest loginRequest = new LoginRequest(username, password);

        Authentication authentication = mock(Authentication.class);
        UserDetailsImpl userDetails = mock(UserDetailsImpl.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getId()).thenReturn(userId);
        when(userDetails.getUsername()).thenReturn(username);
        when(userDetails.getRole()).thenReturn(ERole.USER);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn(jwtToken);

        // Act
        JwtResponse result = loginService.authenticateUser(loginRequest);

        // Assert
        assertNotNull(result);
        assertEquals(jwtToken, result.getToken());
        assertEquals(userId, result.getId());
        assertEquals(username, result.getUsername());
        assertEquals(ERole.USER, result.getRole());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtils).generateJwtToken(authentication);
    }

    @Test
    void authenticateUser_shouldThrowBadCredentialsException_whenAuthenticationFails() {
        // Arrange
        String username = "testUser";
        String password = "wrongPassword";
        LoginRequest loginRequest = new LoginRequest(username, password);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid username or password"));

        // Act & Assert
        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () -> {
            loginService.authenticateUser(loginRequest);
        });

        assertEquals("Invalid username or password", exception.getMessage());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verifyNoInteractions(jwtUtils);
    }
}

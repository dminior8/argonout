package pl.dminior.backend_argonout.security.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import pl.dminior.backend_argonout.configuration.PropertiesConfig;
import pl.dminior.backend_argonout.security.jwt.JwtUtils;
import pl.dminior.backend_argonout.payloads.request.LoginRequest;
import pl.dminior.backend_argonout.payloads.response.JwtResponse;

@Service
@RequiredArgsConstructor
@Log4j2
public class LoginServiceImpl {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PropertiesConfig propertiesConfig;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        log.info("Authenticating user: {}", loginRequest.getUsername());
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException e) {
            log.error("Authentication failed for user: {}", loginRequest.getUsername(), e);
            throw new BadCredentialsException("Invalid username or password", e);
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getRole());
    }


    public HttpHeaders createHeaders(JwtResponse jwtResponse) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add(HttpHeaders.SET_COOKIE, String.valueOf(createAccessTokenCookie(jwtResponse.getToken(), propertiesConfig.getJwtExpirationMs() / 1000)));

        return responseHeaders;
    }

    private HttpCookie createAccessTokenCookie(String token, Long duration) {
        return ResponseCookie.from(propertiesConfig.getAccessTokenCookieName(), token)
                .maxAge(duration)
                .httpOnly(true)
                .sameSite("Strict")
                .path("/")
                .build();
    }

    @Transactional
    public ResponseEntity<JwtResponse> getJwtResponseResponseEntity(LoginRequest loginRequest) {
        JwtResponse jwtResponse = authenticateUser(loginRequest);
        HttpHeaders responseHeaders = createHeaders(jwtResponse);
        return ResponseEntity.ok().headers(responseHeaders).body(jwtResponse);
    }

}

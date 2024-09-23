package pl.dminior.backend_argonout.service;

import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import pl.dminior.backend_argonout.security.payloads.request.LoginRequest;
import pl.dminior.backend_argonout.security.payloads.response.JwtResponse;

public interface LoginService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    HttpHeaders createHeaders(JwtResponse jwtResponse);
    ResponseEntity<JwtResponse> getJwtResponseResponseEntity(LoginRequest loginRequest);
    public HttpCookie createAccessTokenCookie(String token, Long duration);

}


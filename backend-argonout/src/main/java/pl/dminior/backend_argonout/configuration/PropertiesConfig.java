package pl.dminior.backend_argonout.configuration;


import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.Scope;

@Getter
@Scope("singleton")
@PropertySource("classpath:paths.properties")
@Configuration
public class PropertiesConfig {
    @SuppressWarnings("squid:S116")
    @Value("${scm.app.pagination.defaultSizeOfPage}")
    private int PAGE_SIZE;

    @SuppressWarnings("squid:S116")
    @Value("${scm.app.accessTokenCookieName}")
    private String accessTokenCookieName;

    @SuppressWarnings("squid:S116")
    @Value("${scm.app.refreshTokenCookieName}")
    private String refreshTokenCookieName;

    @SuppressWarnings("squid:S116")
    @Value("${scm.app.jwtExpirationMs}")
    private Long jwtExpirationMs;

    @SuppressWarnings("squid:S116")
    @Value("${scm.app.refreshTokenExpirationSec}")
    private Long refreshTokenExpirationSec;

    @Value("${scm.app.paths.login}")
    private String PATH_LOGIN;

    @Value("${scm.app.paths.logout}")
    private String PATH_LOGOUT;
}

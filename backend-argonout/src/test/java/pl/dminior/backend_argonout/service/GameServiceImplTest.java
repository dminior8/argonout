package pl.dminior.backend_argonout.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.dminior.backend_argonout.model.Game;
import pl.dminior.backend_argonout.model.Route;
import pl.dminior.backend_argonout.repository.GameRepository;
import pl.dminior.backend_argonout.repository.RouteRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class GameServiceImplTest {

    @Mock
    private RouteRepository routeRepository;

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private GameServiceImpl gameService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void initGame_shouldReturnGameId_whenRouteExists() {
        // Arrange
        UUID routeId = UUID.randomUUID();
        Route route = new Route();
        route.setId(routeId);

        when(routeRepository.findById(routeId)).thenReturn(Optional.of(route));

        Game savedGame = new Game();
        savedGame.setId(UUID.randomUUID());
        savedGame.setRouteId(routeId);
        savedGame.setStartTime(LocalDateTime.now());
        savedGame.setCompleted(false);

        when(gameRepository.save(any(Game.class))).thenAnswer(invocation -> {
            Game game = invocation.getArgument(0);
            game.setId(savedGame.getId());
            return game;
        });

        // Act
        UUID result = gameService.initGame(routeId);

        // Assert
        assertThat(result).isEqualTo(savedGame.getId());
        verify(routeRepository).findById(routeId);
        verify(gameRepository).save(any(Game.class));
    }

    @Test
    void initGame_shouldReturnNull_whenRouteDoesNotExist() {
        // Arrange
        UUID routeId = UUID.randomUUID();
        when(routeRepository.findById(routeId)).thenReturn(Optional.empty());

        // Act
        UUID result = gameService.initGame(routeId);

        // Assert
        assertThat(result).isNull();
        verify(routeRepository).findById(routeId);
        verifyNoInteractions(gameRepository);
    }

    @Test
    void initGame_shouldSaveGameWithCorrectProperties() {
        // Arrange
        UUID routeId = UUID.randomUUID();
        Route route = new Route();
        route.setId(routeId);

        when(routeRepository.findById(routeId)).thenReturn(Optional.of(route));

        when(gameRepository.save(any(Game.class))).thenAnswer(invocation -> {
            Game game = invocation.getArgument(0);
            game.setId(UUID.randomUUID());
            return game;
        });

        // Act
        UUID result = gameService.initGame(routeId);

        // Assert
        assertThat(result).isNotNull();
        verify(gameRepository).save(argThat(game ->
                game.getRouteId().equals(routeId) &&
                        game.getStartTime() != null &&
                        !game.isCompleted()
        ));
    }
}

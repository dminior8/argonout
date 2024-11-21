package pl.dminior.backend_argonout.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import pl.dminior.backend_argonout.model.*;
import pl.dminior.backend_argonout.repository.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {
    private final RouteRepository routeRepository;
    private final PlaceRepository placeRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final VisitedPlaceRepository visitedPlaceRepository;

    private static final int BASE_POINTS = 15;

    @Override
    @Transactional
    public UUID initGame(UUID routeId) {
        return routeRepository.findById(routeId)
                .map(route -> {
                    Game game = new Game();
                    game.setRouteId(routeId);
                    game.setStartTime(LocalDateTime.now());
                    game.setCompleted(false);
                    gameRepository.save(game);
                    return game.getId();
                })
                .orElse(null);
    }

    @Override
    @Transactional
    public int addPlaceToGame(UUID gameId, UUID placeId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = userRepository.findByUsername(auth.getName()).map(User::getId).orElse(null);

        if (userId == null) {
            return 0; // User not found
        }

        Optional<Game> gameOpt = gameRepository.findById(gameId);
        Optional<Place> placeOpt = placeRepository.findById(placeId);

        if (gameOpt.isEmpty() || placeOpt.isEmpty()) {
            return 0; // Game or Place not found
        }

        Game game = gameOpt.get();
        Place place = placeOpt.get();

        if (!routeRepository.existsByIdAndPlacesId(game.getRouteId(), placeId)) {
            return 3; // Place does not belong to the route
        }

        if (visitedPlaceRepository.existsByGameIdAndPlaceId(gameId, placeId)) {
            return 2; // Place already visited in this game
        }

        if (LocalDateTime.now().isAfter(game.getStartTime().plusMinutes(
                routeRepository.findById(game.getRouteId()).orElseThrow().getMaxTime()))) {
            return -1; // Time expired
        }

        VisitedPlace visitedPlace = new VisitedPlace();
        visitedPlace.setUserId(userId);
        visitedPlace.setGameId(gameId);
        visitedPlace.setPlaceId(placeId);
        visitedPlace.setVisitedAt(LocalDateTime.now());
        visitedPlaceRepository.save(visitedPlace);

        addPointsOfCurrentUser(BASE_POINTS);
        return 1; // Successfully added place
    }

    @Transactional
    @Override
    public boolean endGame(UUID gameId) {
        Optional<Game> gameOpt = gameRepository.findById(gameId);

        if (gameOpt.isEmpty()) {
            return false; // Game not found
        }

        Game game = gameOpt.get();
        UUID routeId = game.getRouteId();

        List<UUID> routePlaces = routeRepository.findPlaceIdsByRouteId(routeId);
        List<UUID> visitedPlaces = visitedPlaceRepository.findPlaceIdsByGameId(gameId);

        if (routePlaces.stream().allMatch(visitedPlaces::contains)) {
            game.setCompleted(true);
            gameRepository.save(game);

            return addPointsOfCurrentUser(BASE_POINTS * 10);
        }

        return false;
    }

    @Transactional
    @Override
    public boolean addPlaceInFreeGame(UUID placeId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = userRepository.findByUsername(auth.getName()).map(User::getId).orElse(null);

        if (userId == null) {
            return false; // User not found
        }

        Optional<Place> placeOpt = placeRepository.findById(placeId);

        if (placeOpt.isEmpty()) {
            return false; // Place not found
        }

        if (visitedPlaceRepository.existsByUserIdAndPlaceId(userId, placeId)) {
            return false; // Place already visited by user
        }

        VisitedPlace visitedPlace = new VisitedPlace();
        visitedPlace.setUserId(userId);
        visitedPlace.setPlaceId(placeId);
        visitedPlace.setVisitedAt(LocalDateTime.now());
        visitedPlaceRepository.save(visitedPlace);

        addPointsOfCurrentUser(BASE_POINTS);
        return true; // Successfully added place
    }

    private boolean addPointsOfCurrentUser(int points) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        return userRepository.findByUsername(username).map(user -> {
            user.setPoints(user.getPoints() + points);
            userRepository.save(user);
            return true;
        }).orElse(false);
    }
}

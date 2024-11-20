package pl.dminior.backend_argonout.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import pl.dminior.backend_argonout.model.*;
import pl.dminior.backend_argonout.repository.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService{
    private final RouteRepository routeRepository;
    private final PlaceRepository placeRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final VisitedPlaceRepository visitedPlaceRepository;

    private static int pointsBase = 15;

    @Override
    @Transactional
    public UUID initGame(UUID routeId){
        if(routeRepository.findById(routeId).isPresent()){
            Game game = new Game();
            game.setRouteId(routeId);
            game.setStartTime(LocalDateTime.now());
            game.setCompleted(false);

            gameRepository.save(game);

            return game.getId();
        }
        return null;
    }

    @Override
    @Transactional
    public int addPlaceToGame(UUID gameId, UUID placeId){
        Optional<Game> game = gameRepository.findById(gameId);
        Optional<Place> place = placeRepository.findById(placeId);
        Optional<Route> route;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = userRepository.findByUsername(auth.getName()).get().getId();

        if(game.isPresent() && place.isPresent()){
            route = Optional.ofNullable(routeRepository.getById(game.get().getRouteId()));
            if(LocalDateTime.now().isBefore(
                    game.get().getStartTime().plusMinutes(
                            route.get().getMaxTime()))){

                if(game.get().getVisitedPlaces().stream().anyMatch(
                        v -> v.getPlaceId().equals(placeId))){
                    return 2; // gdy już odwiedzony w tej grze
                }

                if(route.get().getPlaces().stream().noneMatch(p -> p.getId().equals(placeId))){
                    return 3; //gdy miejsce nie należy do tej trasy
                }

                VisitedPlace visitedPlace = new VisitedPlace();
                visitedPlace.setUserId(userId);
                visitedPlace.setGameId(gameId);
                visitedPlace.setPlaceId(placeId);
                visitedPlace.setVisitedAt(LocalDateTime.now());

                game.get().getVisitedPlaces().add(visitedPlace);

                if(!place.get().isVisited()){
                    place.get().setVisited(true);
                    if(!addPointsOfCurrentUser(pointsBase)){
                        return 4; // gdy nie udało się dodać punktów
                    }
                }

                gameRepository.save(game.get());
                placeRepository.save(place.get());
                return 1; // gdy prawidłowo
            }
            return -1; //gdy po czasie

        }
        return 0; //gdy brak miejsca lub gry
    }

    @Transactional
    @Override
    public boolean endGame(UUID gameId){
        Optional<Game> game = Optional.of(gameRepository.getById(gameId));
        Optional<Route> route = Optional.of(routeRepository.getById(game.get().getRouteId()));

        if(route.get().getPlaces().stream()
                .allMatch(place -> game.get().getVisitedPlaces().stream()
                        .anyMatch(visited -> visited.getPlaceId().equals(place.getId())))){
            route.get().setVisited(true);
            game.get().setCompleted(true);
            routeRepository.save(route.get());
            gameRepository.save(game.get());
            return addPointsOfCurrentUser(pointsBase*10);
        }
        return false;
    }

    @Transactional
    @Override
    public boolean addPlaceInFreeGame(UUID placeId){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = userRepository.findByUsername(auth.getName()).get().getId();
        Optional<Place> place = placeRepository.findById(placeId);
        if(place.isPresent()){
            place.get().setVisited(true);

            VisitedPlace visitedPlace = new VisitedPlace();
            visitedPlace.setUserId(userId);
            visitedPlace.setPlaceId(placeId);
            visitedPlace.setVisitedAt(LocalDateTime.now());

            placeRepository.save(place.get());
            visitedPlaceRepository.save(visitedPlace);

            return true;
        }
        return false;
    }

    private boolean addPointsOfCurrentUser(int points){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);
        if(user != null){
            user.setPoints(user.getPoints() + points);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}

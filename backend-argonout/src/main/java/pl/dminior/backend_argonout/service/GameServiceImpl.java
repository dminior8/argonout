package pl.dminior.backend_argonout.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.dminior.backend_argonout.model.Game;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.model.Route;
import pl.dminior.backend_argonout.model.VisitedPlace;
import pl.dminior.backend_argonout.repository.GameRepository;
import pl.dminior.backend_argonout.repository.PlaceRepository;
import pl.dminior.backend_argonout.repository.RouteRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService{

    private final RouteRepository routeRepository;
    private final PlaceRepository placeRepository;
    private final GameRepository gameRepository;

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
                visitedPlace.setGameId(gameId);
                visitedPlace.setPlaceId(placeId);
                visitedPlace.setVisitedAt(LocalDateTime.now());

                game.get().getVisitedPlaces().add(visitedPlace);

                if(!place.get().isVisited()){
                    place.get().setVisited(true);
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
            return true;
        }
        return false;
    }
}

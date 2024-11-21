package pl.dminior.backend_argonout.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import pl.dminior.backend_argonout.dto.PlaceDTO;
import pl.dminior.backend_argonout.dto.PlaceHistoryDTO;
import pl.dminior.backend_argonout.dto.PlaceWithRouteDTO;
import pl.dminior.backend_argonout.dto.SimpleRouteDTO;
import pl.dminior.backend_argonout.mapper.PlaceMapper;
import pl.dminior.backend_argonout.mapper.RouteMapper;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.model.Route;
import pl.dminior.backend_argonout.model.User;
import pl.dminior.backend_argonout.model.VisitedPlace;
import pl.dminior.backend_argonout.repository.PlaceRepository;
import pl.dminior.backend_argonout.repository.RouteRepository;
import pl.dminior.backend_argonout.repository.UserRepository;
import pl.dminior.backend_argonout.repository.VisitedPlaceRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MapServiceImpl implements MapService{
    private final RouteRepository routeRepository;
    private final PlaceRepository placeRepository;
    private final VisitedPlaceRepository visitedPlaceRepository;
    private final UserRepository userRepository;
    private final RouteMapper routeMapper;
    private final PlaceMapper placeMapper;


    @Override
    public List<PlaceDTO> getAllPlaces(){
        return placeRepository.findAll().stream()
                .map(placeMapper::placeToPlaceDTO).collect(Collectors.toList());
    }

    @Override
    public List<PlaceDTO> getPlaceByRouteId(UUID routeId){
        return routeRepository.findById(routeId).get().getPlaces().stream()
                .map(placeMapper::placeToPlaceDTO).collect(Collectors.toList());
    }

    @Override
    public Page<PlaceHistoryDTO> getAllVisitedPlacesForCurrentUser(Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        List<VisitedPlace> visitedPlaces = visitedPlaceRepository.findAllVisitedPlacesByUserId(currentUser.getId());

        List<PlaceHistoryDTO> placeHistoryDTO = visitedPlaces.stream().map(visitedPlace -> {
            Place place = placeRepository.findById(visitedPlace.getPlaceId())
                    .orElseThrow(() -> new EntityNotFoundException("Place not found"));

            String routeName = routeRepository.findRouteNameByGameId(visitedPlace.getGameId())
                    .orElse("Unknown Route");

            return new PlaceHistoryDTO(
                    place.getId(),
                    place.getName(),
                    place.getDescription(),
                    place.getLatitude(),
                    place.getLongitude(),
                    routeName,
                    visitedPlace.getVisitedAt().toLocalDate()
            );
        }).collect(Collectors.toList());

        return new PageImpl<>(placeHistoryDTO, pageable, placeHistoryDTO.size());
    }

    @Override
    public void setLocation(PlaceWithRouteDTO placeWithRouteDTO){

        Route route = routeRepository.findById(placeWithRouteDTO.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        Place place = new Place();
        place.setName(placeWithRouteDTO.getName());
        place.setDescription(placeWithRouteDTO.getDescription());
        place.setLongitude(placeWithRouteDTO.getLongitude());
        place.setLatitude(placeWithRouteDTO.getLatitude());
        place.setMoreInfoLink(placeWithRouteDTO.getMoreInfoLink());

        route.getPlaces().add(place);

        routeRepository.save(route);
    }

    @Transactional
    @Override
    public PlaceWithRouteDTO editLocation(UUID placeId, PlaceWithRouteDTO placeDTO) {
        Place currentPlace = placeRepository.findById(placeId).orElse(null);

        if (currentPlace != null) {
            currentPlace.setName(placeDTO.getName());
            currentPlace.setDescription(placeDTO.getDescription());
            currentPlace.setLongitude(placeDTO.getLongitude());
            currentPlace.setLatitude(placeDTO.getLatitude());
            currentPlace.setMoreInfoLink(placeDTO.getMoreInfoLink());

            // Sprawdź, czy nowa trasa jest różna od aktualnej
            UUID newRouteId = placeDTO.getRouteId();
            Route newRoute = routeRepository.findById(newRouteId).orElse(null);

            if (newRoute != null) {
                List<Route> routesWithPlace = routeRepository.findAll().stream()
                        .filter(route -> route.getPlaces().contains(currentPlace))
                        .toList();

                for (Route route : routesWithPlace) {
                    route.getPlaces().remove(currentPlace);
                    routeRepository.save(route);
                }

                newRoute.getPlaces().add(currentPlace);
                routeRepository.save(newRoute);
            }

            placeRepository.save(currentPlace);

            return placeDTO;
        }

        return null;
    }


    @Transactional
    @Override
    public boolean deletePlace(UUID placeId) {
        if (placeRepository.findById(placeId).isPresent()) {

            List<Route> routes = routeRepository.findAll();

            for (Route route : routes) {
                route.getPlaces().removeIf(p -> p.getId().equals(placeId));
                routeRepository.save(route);
            }
            placeRepository.deleteById(placeId);
            return true;
        }
        return false;
    }

    @Override
    public List<SimpleRouteDTO> getAllRoutes() {
        return routeRepository.findAll().stream()
                .map(routeMapper::mapToSimpleRouteDTO)
                .toList();
    }
}

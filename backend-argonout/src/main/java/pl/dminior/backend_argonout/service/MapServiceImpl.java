package pl.dminior.backend_argonout.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.dminior.backend_argonout.dto.PlaceWithRouteDTO;
import pl.dminior.backend_argonout.dto.SimpleRouteDTO;
import pl.dminior.backend_argonout.mapper.RouteMapper;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.model.Route;
import pl.dminior.backend_argonout.repository.PlaceRepository;
import pl.dminior.backend_argonout.repository.RouteRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MapServiceImpl implements MapService{
    private final RouteRepository routeRepository;
    private final PlaceRepository placeRepository;
    private final RouteMapper routeMapper;

    @Override
    public List<Place> getAllPlaces(){
        return placeRepository.findAll();
    }

    @Override
    public List<Place> getPlaceByRouteId(UUID routeId){
        return routeRepository.findById(routeId).get().getPlaces();
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

            // Usuń powiązania w tabeli routes_places
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

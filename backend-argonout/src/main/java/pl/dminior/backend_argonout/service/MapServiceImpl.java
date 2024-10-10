package pl.dminior.backend_argonout.service;

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

@Service
@RequiredArgsConstructor
public class MapServiceImpl implements MapService{
    private final RouteRepository routeRepository;
    private final PlaceRepository placeRepository;
    private final RouteMapper routeMapper;

    @Override
    public List<Place> getAllLocations(){
        return placeRepository.findAll();
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

    @Override
    public List<SimpleRouteDTO> getAllRoutes() {
        return routeRepository.findAll().stream()
                .map(routeMapper::mapToSimpleRouteDTO)
                .toList();
    }
}

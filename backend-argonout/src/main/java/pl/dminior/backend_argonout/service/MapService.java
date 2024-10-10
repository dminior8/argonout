package pl.dminior.backend_argonout.service;

import pl.dminior.backend_argonout.dto.PlaceWithRouteDTO;
import pl.dminior.backend_argonout.dto.SimpleRouteDTO;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.model.Route;

import java.util.List;

public interface MapService {
    List<Place> getAllLocations();

    void setLocation(PlaceWithRouteDTO placeWithRouteDTO);

    List<SimpleRouteDTO> getAllRoutes();
}

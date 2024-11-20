package pl.dminior.backend_argonout.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.dminior.backend_argonout.dto.PlaceDTO;
import pl.dminior.backend_argonout.dto.PlaceHistoryDTO;
import pl.dminior.backend_argonout.dto.PlaceWithRouteDTO;
import pl.dminior.backend_argonout.dto.SimpleRouteDTO;
import pl.dminior.backend_argonout.model.Place;

import java.util.List;
import java.util.UUID;

public interface MapService {
    List<PlaceDTO> getAllPlaces();

    List<PlaceDTO> getPlaceByRouteId(UUID routeId);

    void setLocation(PlaceWithRouteDTO placeWithRouteDTO);

    PlaceWithRouteDTO editLocation(UUID placeId, PlaceWithRouteDTO place);

    boolean deletePlace(UUID placeId);

    List<SimpleRouteDTO> getAllRoutes();

    Page<PlaceHistoryDTO> getAllVisitedPlacesForCurrentUser(Pageable pageable);
}

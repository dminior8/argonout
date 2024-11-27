package pl.dminior.backend_argonout.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.dminior.backend_argonout.dto.PlaceDTO;
import pl.dminior.backend_argonout.dto.PlaceHistoryDTO;
import pl.dminior.backend_argonout.dto.PlaceWithRouteDTO;
import pl.dminior.backend_argonout.dto.SimpleRouteDTO;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.security.payloads.response.MessageResponse;
import pl.dminior.backend_argonout.service.MapService;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MapController {
    private final MapService mapService;


    @GetMapping("/places")
    public ResponseEntity<List<PlaceDTO>> getAllPlaces() {
        return ResponseEntity.ok().body(mapService.getAllPlaces());
    }

    @GetMapping("/places/{routeId}")
    public ResponseEntity<List<PlaceDTO>> getPlacesByRouteId(@PathVariable UUID routeId) {
        return ResponseEntity.ok().body(mapService.getPlaceByRouteId(routeId));
    }

    @PostMapping("/map/places/add")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> setPlace(@RequestBody PlaceWithRouteDTO placeWithRouteDTO) {
        mapService.setLocation(placeWithRouteDTO);
            return ResponseEntity.ok().body(new MessageResponse("Place edited successfully"));
    }

    @GetMapping("/places/visited")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public Page<PlaceHistoryDTO> getAllVisitedPlacesForCurrentUser(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("points")));
        return mapService.getAllVisitedPlacesForCurrentUser(pageable);
    }

    @PutMapping("/map/places/{placeId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> editPlace(@PathVariable UUID placeId, @RequestBody PlaceWithRouteDTO placeWithRouteDTO) {
        PlaceWithRouteDTO place = mapService.editLocation(placeId, placeWithRouteDTO);
        if(place != null){
            return ResponseEntity.ok().body(new MessageResponse("Place edited successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Error during place editing"));
    }

    @DeleteMapping("/map/places/{placeId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> deletePlace(@PathVariable UUID placeId) {
        if(mapService.deletePlace(placeId)){
            return ResponseEntity.ok().body(new MessageResponse("Place deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error during place deleting"));
    }

    @GetMapping("/routes/all")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<SimpleRouteDTO>> getAllRoutes() {
        return ResponseEntity.ok().body(mapService.getAllRoutes());
    }

}

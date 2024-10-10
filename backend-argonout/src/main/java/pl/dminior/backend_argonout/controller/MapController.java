package pl.dminior.backend_argonout.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.dminior.backend_argonout.dto.PlaceWithRouteDTO;
import pl.dminior.backend_argonout.dto.SimpleRouteDTO;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.model.Route;
import pl.dminior.backend_argonout.security.payloads.request.LoginRequest;
import pl.dminior.backend_argonout.security.payloads.response.JwtResponse;
import pl.dminior.backend_argonout.security.payloads.response.MessageResponse;
import pl.dminior.backend_argonout.service.LoginServiceImpl;
import pl.dminior.backend_argonout.service.MapService;
import pl.dminior.backend_argonout.service.UserServiceImpl;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MapController {
    private final MapService mapService;


    @GetMapping("/map/all-locations")
    public ResponseEntity<List<Place>> getAllLocations() {
        return ResponseEntity.ok().body(mapService.getAllLocations());
    }


    @PostMapping(value = "/map/add-location")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> setLocation(@RequestBody PlaceWithRouteDTO placeWithRouteDTO) {

        mapService.setLocation(placeWithRouteDTO);
            return ResponseEntity.ok().body(new MessageResponse("Place added successfully"));
    }

    @GetMapping("/routes/all")
    public ResponseEntity<List<SimpleRouteDTO>> getAllRoutes() {
        return ResponseEntity.ok().body(mapService.getAllRoutes());
    }
}

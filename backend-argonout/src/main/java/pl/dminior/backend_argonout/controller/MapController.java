package pl.dminior.backend_argonout.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.security.payloads.request.LoginRequest;
import pl.dminior.backend_argonout.security.payloads.response.JwtResponse;
import pl.dminior.backend_argonout.service.LoginServiceImpl;
import pl.dminior.backend_argonout.service.MapService;
import pl.dminior.backend_argonout.service.UserServiceImpl;

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
}

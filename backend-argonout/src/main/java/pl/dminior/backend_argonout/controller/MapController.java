package pl.dminior.backend_argonout.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.dminior.backend_argonout.model.Place;
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


    @PostMapping(value = "/map/add-location", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> setLocation(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("moreInfoLink") String moreInfoLink,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        // Tworzenie obiektu Place na podstawie otrzymanych danych
        Place place = new Place();
        place.setName(name);
        place.setDescription(description);
        place.setMoreInfoLink(moreInfoLink);
        place.setLatitude(latitude);
        place.setLongitude(longitude);
        place.setImage(null);
        // Logika dodawania obrazu (jeśli przekazany)
        if (image != null && !image.isEmpty()) {
            try {
                place.setImage(image.getBytes()); // Przekształcenie obrazu na tablicę bajtów
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error processing image"));
            }
        }

        if (mapService.setLocation(place)) {
            return ResponseEntity.ok().body(new MessageResponse("Place added successfully"));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Error during place adding"));
    }
}

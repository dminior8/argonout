package pl.dminior.backend_argonout.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import pl.dminior.backend_argonout.model.Route;

import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class PlaceWithRouteDTO {
    private String name;

    private String description;

    private Double latitude;

    private Double longitude;

    private String moreInfoLink;

    private UUID routeId;
}

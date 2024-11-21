package pl.dminior.backend_argonout.dto;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class PlaceDTO {
    private UUID id;

    private String name;

    @Column(length = 1000)
    private String description;

    private Double latitude;

    private Double longitude;

    private String moreInfoLink;

    private boolean isVisited;
}

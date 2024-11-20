package pl.dminior.backend_argonout.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class PlaceHistoryDTO {
    private UUID placeId;
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;
    private String routeName;
    private LocalDate visitedAt;
}

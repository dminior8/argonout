package pl.dminior.backend_argonout.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@RequiredArgsConstructor
public class SimpleRouteDTO {
    private UUID id;
    private String name;
    private String description;
    private int maxTime;
}

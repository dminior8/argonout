package pl.dminior.backend_argonout.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "visited_places")
public class VisitedPlace {
    @Id
    @Column(name = "visited_places_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private UUID userId;
    private UUID gameId;
    private UUID placeId;
    private LocalDateTime visitedAt;
}

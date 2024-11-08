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

    private UUID placeId;

    //@ManyToOne
    //@JoinColumn(name = "game_id")
    private UUID gameId;

    private LocalDateTime visitedAt;

//    public VisitedPlace(UUID gameId, UUID placeId, LocalDateTime visitedAt) {
//        this.gameId = gameId;
//        this.placeId = placeId;
//        this.visitedAt = visitedAt;
//    }


//    @ManyToOne
//    @JoinColumn(name = "game_id", insertable = false, updatable = false)
//    private Game game;
}

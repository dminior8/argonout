package pl.dminior.backend_argonout.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.model.Route;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RouteRepository extends JpaRepository<Route, UUID> {
    Route getById(UUID id);

    @Query("SELECT r.name FROM Route r JOIN Game g ON r.id = g.routeId WHERE g.id = :gameId")
    Optional<String> findRouteNameByGameId(@Param("gameId") UUID gameId);
}

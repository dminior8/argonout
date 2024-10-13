package pl.dminior.backend_argonout.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.model.Route;

import java.util.UUID;

@Repository
public interface RouteRepository extends JpaRepository<Route, UUID> {


    Route getById(UUID id);
}

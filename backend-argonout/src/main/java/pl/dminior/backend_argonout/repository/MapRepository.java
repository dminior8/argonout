package pl.dminior.backend_argonout.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.dminior.backend_argonout.model.Place;

import java.util.UUID;

public interface MapRepository extends JpaRepository<Place, UUID> {
}

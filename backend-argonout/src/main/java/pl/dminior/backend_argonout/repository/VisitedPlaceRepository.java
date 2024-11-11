package pl.dminior.backend_argonout.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.dminior.backend_argonout.model.VisitedPlace;

import java.util.UUID;

public interface VisitedPlaceRepository  extends JpaRepository<VisitedPlace, UUID> {
}

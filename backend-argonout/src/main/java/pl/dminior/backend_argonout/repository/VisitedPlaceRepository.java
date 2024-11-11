package pl.dminior.backend_argonout.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.dminior.backend_argonout.model.VisitedPlace;

import java.util.UUID;

@Repository
public interface VisitedPlaceRepository  extends JpaRepository<VisitedPlace, UUID> {
}

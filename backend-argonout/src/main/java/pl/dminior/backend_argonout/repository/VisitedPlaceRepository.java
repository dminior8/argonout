package pl.dminior.backend_argonout.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.dminior.backend_argonout.model.VisitedPlace;

import java.util.List;
import java.util.UUID;

@Repository
public interface VisitedPlaceRepository  extends JpaRepository<VisitedPlace, UUID> {


    List<VisitedPlace> findAllVisitedPlacesByUserId(UUID userId);

    boolean existsByUserIdAndPlaceId(UUID userId, UUID placeId);

    boolean existsByGameIdAndPlaceId(UUID placeId, UUID gameId);

    List<UUID> findPlaceIdsByGameId(UUID gameId);

}

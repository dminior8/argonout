package pl.dminior.backend_argonout.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.dminior.backend_argonout.model.League;

import java.util.UUID;

@Repository
public interface LeagueRepository extends JpaRepository<League, UUID> {

    @Query("SELECT l FROM League l WHERE :points >= l.minPoints AND :points <= l.maxPoints")
    League getLeagueByPoints(int points);
}

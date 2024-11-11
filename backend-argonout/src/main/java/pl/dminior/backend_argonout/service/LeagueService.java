package pl.dminior.backend_argonout.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pl.dminior.backend_argonout.dto.LeaderboardUserDTO;
import pl.dminior.backend_argonout.model.League;

import java.util.List;
import java.util.UUID;

public interface LeagueService {
    List<League> getAllLeagues();

    Page<LeaderboardUserDTO> getAllUsersFromLeagueById(UUID id, Pageable pageable);

    Integer getCurrentPlayerPositionInLeague();
}

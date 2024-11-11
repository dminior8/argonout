package pl.dminior.backend_argonout.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import pl.dminior.backend_argonout.dto.LeaderboardUserDTO;
import pl.dminior.backend_argonout.model.League;
import pl.dminior.backend_argonout.model.User;
import pl.dminior.backend_argonout.repository.LeagueRepository;
import pl.dminior.backend_argonout.repository.UserRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeagueServiceImpl implements LeagueService {
    private final UserRepository userRepository;
    private final LeagueRepository leagueRepository;

    @Override
    public List<League> getAllLeagues() {
        return leagueRepository.findAll();
    }

    @Override
    @Transactional
    public Page<LeaderboardUserDTO> getAllUsersFromLeagueById(UUID id, Pageable pageable) {
        League league = leagueRepository.findById(id).orElse(null);

        if (league != null) {
            Page<User> userPage = userRepository.findAllByPointsGreaterThanAndPointsLessThan(
                    league.getMinPoints(), league.getMaxPoints(), pageable);

            List<LeaderboardUserDTO> userDTOs = userPage.stream()
                    .map(user -> new LeaderboardUserDTO(user.getId(), user.getUsername(), user.getPoints()))
                    .collect(Collectors.toList());

            return new PageImpl<>(userDTOs, pageable, userPage.getTotalElements());
        }

        return Page.empty();
    }

    @Override
    public Integer getCurrentPlayerPositionInLeague(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            throw new RuntimeException("Użytkownik nie znaleziony");
        }

        League league = leagueRepository.getLeagueByPoints(user.getPoints());
        if (league == null) {
            throw new RuntimeException("Liga nieznaleziona dla podanej liczby punktów");
        }

        List<User> usersInLeague = userRepository
                .findAllByPointsBetweenOrderByPointsDesc(league.getMinPoints(), league.getMaxPoints());

        int position = -1;
        for (int i = 0; i < usersInLeague.size(); i++) {
            if (usersInLeague.get(i).getUsername().equals(username)) {
                position = i + 1; // Pozycje w rankingu zaczynamy od 1
                break;
            }
        }

        if (position == -1) {
            throw new RuntimeException("Użytkownik nie znaleziony w lidze");
        }
        return position;
    }

}

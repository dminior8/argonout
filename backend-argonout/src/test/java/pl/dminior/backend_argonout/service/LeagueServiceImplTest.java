package pl.dminior.backend_argonout.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import pl.dminior.backend_argonout.dto.LeaderboardUserDTO;
import pl.dminior.backend_argonout.model.League;
import pl.dminior.backend_argonout.model.User;
import pl.dminior.backend_argonout.repository.LeagueRepository;
import pl.dminior.backend_argonout.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class LeagueServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private LeagueRepository leagueRepository;

    @InjectMocks
    private LeagueServiceImpl leagueService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllUsersFromLeagueById_shouldReturnUsers_whenLeagueExists() {
        // Arrange
        UUID leagueId = UUID.randomUUID();
        League league = new League();
        league.setId(leagueId);
        league.setMinPoints(100);
        league.setMaxPoints(200);

        when(leagueRepository.findById(leagueId)).thenReturn(Optional.of(league));

        User user1 = User.builder()
                .id(UUID.randomUUID())
                .username("user1")
                .points(150)
                .build();
        User user2 = User.builder()
                .id(UUID.randomUUID())
                .username("user2")
                .points(180)
                .build();
        List<User> users = List.of(user1, user2);
        Pageable pageable = PageRequest.of(0, 10);
        Page<User> userPage = new PageImpl<>(users, pageable, users.size());

        when(userRepository.findAllByPointsGreaterThanAndPointsLessThan(
                league.getMinPoints(), league.getMaxPoints(), pageable)).thenReturn(userPage);

        // Act
        Page<LeaderboardUserDTO> result = leagueService.getAllUsersFromLeagueById(leagueId, pageable);

        // Assert
        assertThat(result.getContent())
                .hasSize(2)
                .extracting(LeaderboardUserDTO::getUsername)
                .containsExactlyInAnyOrder("user1", "user2");

        verify(leagueRepository).findById(leagueId);
        verify(userRepository).findAllByPointsGreaterThanAndPointsLessThan(
                league.getMinPoints(), league.getMaxPoints(), pageable);
    }

    @Test
    void getAllUsersFromLeagueById_shouldReturnEmptyPage_whenLeagueDoesNotExist() {
        // Arrange
        UUID leagueId = UUID.randomUUID();
        Pageable pageable = PageRequest.of(0, 10);

        when(leagueRepository.findById(leagueId)).thenReturn(Optional.empty());

        // Act
        Page<LeaderboardUserDTO> result = leagueService.getAllUsersFromLeagueById(leagueId, pageable);

        // Assert
        assertThat(result).isEmpty();
        verify(leagueRepository).findById(leagueId);
        verifyNoInteractions(userRepository);
    }
}

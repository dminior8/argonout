package pl.dminior.backend_argonout.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.dminior.backend_argonout.dto.LeaderboardUserDTO;
import pl.dminior.backend_argonout.model.League;
import pl.dminior.backend_argonout.service.LeagueService;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class LeagueController {
    private final LeagueService leagueService;

    @GetMapping("/leagues/all")
    public ResponseEntity<List<League>> getAllLeagues(){
        List<League> leagues = leagueService.getAllLeagues();

        if(leagues.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.status(HttpStatus.OK).body(leagues);
    }

    @GetMapping("/leagues/{leagueId}")
    public Page<LeaderboardUserDTO> getAllUsersFromLeague(
            @PathVariable UUID leagueId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("points")));
        return leagueService.getAllUsersFromLeagueById(leagueId, pageable);

    }

    @GetMapping("leagues/current-player/position")
    public ResponseEntity<Integer> getCurrentPlayerPositionInLeague(){
        Integer position = leagueService.getCurrentPlayerPositionInLeague();
        if(position != 0){
            return new ResponseEntity<>(position, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    //TODO: Endpoint zwracający pozycję aktualnego użytkownika w lidze
}
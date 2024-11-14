package pl.dminior.backend_argonout.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.dminior.backend_argonout.security.payloads.response.MessageResponse;
import pl.dminior.backend_argonout.service.GameService;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class GameController {
    private final GameService gameService;

    @PostMapping("/game/init/{routeId}")
    public ResponseEntity<UUID> initGame(@PathVariable UUID routeId){
        UUID gameId = gameService.initGame(routeId);
        if(gameId != null){
            return ResponseEntity.ok().body(gameId);
        }
        return ResponseEntity.badRequest().body(null);
    }

    @PostMapping("/game/{gameId}/add-place/{placeId}")
    ResponseEntity<MessageResponse> addPlaceToGame(@PathVariable UUID gameId, @PathVariable UUID placeId){
        int status = gameService.addPlaceToGame(gameId, placeId);
        switch (status){
            case -1 -> {
                return ResponseEntity.badRequest().body(new MessageResponse("Time is up during adding place"));
            }
            case 0 -> {
                return ResponseEntity.badRequest().body(new MessageResponse("Wrong placeId or gameId"));
            }
            case 1 -> {
                return ResponseEntity.ok().body(new MessageResponse("Place added successfully"));
            }
            case 2 -> {
                return ResponseEntity.badRequest().body(new MessageResponse("Place already added during this game"));
            }
            case 3 -> {
                return ResponseEntity.badRequest().body(new MessageResponse("Place is not part of this game"));
            }
            case 4 -> {
                return ResponseEntity.badRequest().body(new MessageResponse("Error during points adding"));
            }
            default -> {
                return ResponseEntity.badRequest().body(new MessageResponse("Other error during adding place to game"));
            }
        }
    }

    @PostMapping("/game/{gameId}/end")
    public ResponseEntity<MessageResponse> endGame(@PathVariable UUID gameId){
        if(gameService.endGame(gameId)){
            return ResponseEntity.ok().body(new MessageResponse("Game ended - all places collected"));
        }
        return ResponseEntity.ok().body(new MessageResponse("Game ended - failed to visit all places"));

    }

    @PostMapping("/free-game/add-place/{placeId}")
    public ResponseEntity<MessageResponse> addPlaceInFreeGame(@PathVariable UUID placeId){

        if(gameService.addPlaceInFreeGame(placeId)){
            return ResponseEntity.ok().body(new MessageResponse("Place visited succesfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Place not found"));
    }
}

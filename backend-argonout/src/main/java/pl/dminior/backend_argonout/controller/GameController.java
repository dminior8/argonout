package pl.dminior.backend_argonout.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.dminior.backend_argonout.security.payloads.response.MessageResponse;
import pl.dminior.backend_argonout.service.GameService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class GameController {
    private final GameService gameService;

    @PostMapping("/game/init/{routeId}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<UUID> initGame(@PathVariable UUID routeId){
        UUID gameId = gameService.initGame(routeId);
        if(gameId != null){
            return ResponseEntity.ok().body(gameId);
        }
        return ResponseEntity.badRequest().body(null);
    }

    @PostMapping("/game/{gameId}/add-place/{placeId}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    ResponseEntity<MessageResponse> addPlaceToGame(
            @PathVariable UUID gameId,
            @PathVariable UUID placeId,
            @RequestBody Map<String, String> qrCodeData){


        try {
            UUID placeIdFromQR = UUID.fromString(qrCodeData.get("qrCodeData"));
            if(!placeId.equals(placeIdFromQR)){
                return ResponseEntity.badRequest().body(new MessageResponse("QR code is different from placeId"));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid QR data format"));
        }

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
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> endGame(@PathVariable UUID gameId){
        if(gameService.endGame(gameId)){
            return ResponseEntity.ok().body(new MessageResponse("Game ended - all places collected"));
        }
        return ResponseEntity.ok().body(new MessageResponse("Game ended - failed to visit all places"));

    }

    @PostMapping("/free-game/add-place/{placeId}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<MessageResponse> addPlaceInFreeGame(
            @PathVariable UUID placeId,
            @RequestBody Map<String, String> qrCodeData){

        try {
            UUID placeIdFromQR = UUID.fromString(qrCodeData.get("qrCodeData"));
            if(!placeId.equals(placeIdFromQR)){
                return ResponseEntity.badRequest().body(new MessageResponse("QR code is different from placeId"));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid QR data format"));
        }

        switch (gameService.addPlaceInFreeGame(placeId)){
            case -1 -> {return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Place not found"));}
            case 0 -> {return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Place already visited today"));}
            case 1 -> {return ResponseEntity.ok().body(new MessageResponse("Place visited succesfully"));}
            default -> {return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Unknown error"));}
        }
    }
}

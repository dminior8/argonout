package pl.dminior.backend_argonout.service;

import java.util.UUID;

public interface GameService {

    UUID initGame(UUID routeId);

    int addPlaceToGame(UUID gameId, UUID placeId);

    boolean endGame(UUID gameId);

    boolean addPlaceInFreeGame(UUID placeId);
}

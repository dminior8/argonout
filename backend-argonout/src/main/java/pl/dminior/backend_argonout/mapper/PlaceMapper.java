package pl.dminior.backend_argonout.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import pl.dminior.backend_argonout.dto.PlaceDTO;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.repository.UserRepository;
import pl.dminior.backend_argonout.repository.VisitedPlaceRepository;

import java.util.UUID;

@Mapper(componentModel = "spring")
public abstract class PlaceMapper {

    private UserRepository userRepository;
    private VisitedPlaceRepository visitedPlaceRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository,
                                  VisitedPlaceRepository visitedPlaceRepository) {
        this.userRepository = userRepository;
        this.visitedPlaceRepository = visitedPlaceRepository;
    }

    @Mapping(target = "visited", expression = "java(isVisited(place.getId()))")
    public abstract PlaceDTO placeToPlaceDTO(Place place);

    public boolean isVisited(UUID placeId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = userRepository.findByUsername(auth.getName()).map(user -> user.getId()).orElse(null);

        return userId != null && visitedPlaceRepository.existsByUserIdAndPlaceId(userId, placeId);
    }
}
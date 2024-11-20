package pl.dminior.backend_argonout.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import pl.dminior.backend_argonout.dto.SimpleRouteDTO;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.model.Route;

@Mapper(componentModel = "spring")
public interface PlaceMapper {

    SimpleRouteDTO mapToSimpleRouteDTO(Place place);
}

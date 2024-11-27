package pl.dminior.backend_argonout.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import pl.dminior.backend_argonout.dto.GetUserByAdminDTO;
import pl.dminior.backend_argonout.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", source = "user.id")
    GetUserByAdminDTO getUserByAdminDTO(User user);
}

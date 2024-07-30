package pl.dminior.backend_argonout.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.dminior.backend_argonout.model.User;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    User findByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);
}

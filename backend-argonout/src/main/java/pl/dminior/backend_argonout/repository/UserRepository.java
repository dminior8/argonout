package pl.dminior.backend_argonout.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.dminior.backend_argonout.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);

    @Modifying
    @Query(value = "DELETE FROM users WHERE username = ?1",  nativeQuery = true)
    void deleteByUsername(String username);

    Page<User> findAllByPointsGreaterThanAndPointsLessThan(int minPoints, int maxPoints, Pageable pageable);

    List<User> findAllByPointsBetweenOrderByPointsDesc(int minPoints, int maxPoints);
}

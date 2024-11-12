package pl.dminior.backend_argonout.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.dminior.backend_argonout.model.Message;

import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    Page<Message> findAll(Pageable pageable);

    Message findMessageById(UUID messageId);
}

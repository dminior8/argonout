package pl.dminior.backend_argonout.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "\"users\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_id")
    private UUID id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "username", unique = true)
    private String username;

    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "email", unique = true)
    private String email;

    @NotNull
    @Size(max = 255)
    @Column(name = "password_hash")
    private String password;

    @Size(max = 50)
    @Column(name = "first_name")
    private String firstName;

    @Size(max = 50)
    @Column(name = "last_name")
    private String lastName;

    @NotNull
    @Column(name = "role_id")
    private ERole role;

    @Column(name = "points", columnDefinition = "int default 0")
    private Integer points;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public List<ERole> getRoles() {
        List<ERole> enumList = new ArrayList<>();
        enumList.add(role);
        return enumList;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
package pl.dminior.backend_argonout.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "leagues")
public class League {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "league_id")
    UUID id;
    String name;
    int minPoints;
    int maxPoints;
}

package pl.dminior.backend_argonout.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;


@Getter
@Setter
@Entity
@Table(name = "places")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "place_id")
    private UUID id;

    private String name;

    private String description;

    private Double latitude;

    private Double longitude;

    private String moreInfoLink;

    private boolean isVisited;

}

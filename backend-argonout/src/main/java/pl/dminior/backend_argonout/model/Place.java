package pl.dminior.backend_argonout.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "places")
public class Place {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID placeId;

    private String name;

    private String description;

    private Double latitude;

    private Double longitude;

    private String moreInfoLink;

    @Lob
    private byte[] image;
}

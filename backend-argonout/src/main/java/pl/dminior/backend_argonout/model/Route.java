package pl.dminior.backend_argonout.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "routes")
@Getter
@Setter
public class Route {

      @Id
      @GeneratedValue(strategy = GenerationType.UUID)
      @Column(name = "route_id")
      private UUID id;

      private String name;

      private String description;

      private int maxTime;

      @OneToMany(cascade = CascadeType.ALL)
      @JoinTable(
              name = "routes_places",
              joinColumns = @JoinColumn(name = "route_id"),
              inverseJoinColumns = @JoinColumn(name = "place_id")
      )
      private List<Place> places;
}

package pl.dminior.backend_argonout.service;

import pl.dminior.backend_argonout.model.Place;

import java.util.List;

public interface MapService {
    List<Place> getAllLocations();

    boolean setLocation(Place place);
}

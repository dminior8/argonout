package pl.dminior.backend_argonout.service;

import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.repository.MapRepository;

import java.util.List;

@Service
public class MapServiceImpl implements MapService{
    private final MapRepository mapRepository;

    public MapServiceImpl(MapRepository mapRepository) {
        this.mapRepository = mapRepository;
    }

    @Override
    public List<Place> getAllLocations(){
        return mapRepository.findAll();
    }
}

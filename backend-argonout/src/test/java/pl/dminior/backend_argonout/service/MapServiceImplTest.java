package pl.dminior.backend_argonout.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pl.dminior.backend_argonout.dto.PlaceDTO;
import pl.dminior.backend_argonout.mapper.PlaceMapper;
import pl.dminior.backend_argonout.model.Place;
import pl.dminior.backend_argonout.repository.PlaceRepository;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class MapServiceImplTest {

    @Mock
    private PlaceRepository placeRepository;

    @Mock
    private PlaceMapper placeMapper;

    @InjectMocks
    private MapServiceImpl mapService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllPlaces_shouldReturnAllPlaces() {
        // Arrange
        Place place1 = new Place();
        place1.setId(UUID.randomUUID());
        place1.setName("Place 1");

        Place place2 = new Place();
        place2.setId(UUID.randomUUID());
        place2.setName("Place 2");

        List<Place> places = List.of(place1, place2);

        PlaceDTO placeDTO1 = new PlaceDTO();
        placeDTO1.setName("Place 1");

        PlaceDTO placeDTO2 = new PlaceDTO();
        placeDTO2.setName("Place 2");

        when(placeRepository.findAll()).thenReturn(places);
        when(placeMapper.placeToPlaceDTO(place1)).thenReturn(placeDTO1);
        when(placeMapper.placeToPlaceDTO(place2)).thenReturn(placeDTO2);

        // Act
        List<PlaceDTO> result = mapService.getAllPlaces();

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).extracting(PlaceDTO::getName).containsExactlyInAnyOrder("Place 1", "Place 2");

        verify(placeRepository).findAll();
        verify(placeMapper).placeToPlaceDTO(place1);
        verify(placeMapper).placeToPlaceDTO(place2);
    }
}

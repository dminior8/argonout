import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from 'axios';

import Sidebar from "../sidebar/Sidebar";
import BasicMap from "../map/BasicMap";
import { useUser } from '../../contexts/UserContext';
import './homePanel.css';
import MiniStats from "../miniStats/MiniStats";

// Komponent formularza dodawania miejsca
const PlaceForm = ({ position, onSubmit, onClose, placeData = null }) => {
  const [formData, setFormData] = useState({
    name: placeData?.name || '',
    description: placeData?.description || '',
    selectedRoute: placeData?.selectedMap || '',
    moreInfoLink: placeData?.moreInfoLink || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({...formData, selectedMap});
  };

  //ROUTES OPTIONS
  const [maps, setMaps] = useState([]); // Stan do przechowywania listy map
  const [selectedMap, setSelectedMap] = useState(placeData?.selectedMap || null); // Stan do przechowywania wybranej mapy

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const token = Cookies.get('accessTokenFront');
        const response = await axios.get('http://localhost:8080/api/routes/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMaps(response.data);
      } catch (error) {
        console.error('Error during routes fetching: ', error);
      }
    };
    fetchMaps();
  }, []);

  const handleMapChange = (e) => {
    const selectedMapId = e.target.value;
    const map = maps.find((m) => m.id === selectedMapId);
    setSelectedMap(map);
  };

  return (
    <div className="add-place-form">
      {placeData ? 'Edytuj miejsce' : 'Dodaj nowe miejsce'}
      <br/>
      {position && (
        <p>Miejsce w lokalizacji: {`(${position.lat}, ${position.lng})`}</p>
      )}
      <form onSubmit={handleSubmit} className="place-form">
        <input
          className="text-input"
          type="text"
          name="name"
          placeholder="Nazwa"
          value={formData.name}
          onChange={handleInputChange}
          style={{marginTop:"3vh"}}
          required
        />
        <textarea
          className="text-input"
          name="description"
          placeholder="Opis"
          rows="4"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <input
          className="text-input"
          type="url"
          name="moreInfoLink"
          placeholder="Link"
          value={formData.moreInfoLink}
          onChange={handleInputChange}
          required
        />
        <select
          className="form-select"
          id="mapSelect"
          value={selectedMap ? selectedMap.id : ''}
          onChange={handleMapChange}
          required
        >
          <option value="">Wybierz mapę</option>
          {maps.map((map) => (
            <option key={map.id} value={map.id}>
              {map.name}
            </option>
          ))}
        </select>
        <br />
        <button type="submit" className="btn btn-secondary">
          {placeData ? 'Zapisz zmiany' : 'Dodaj miejsce'}
        </button>
      </form>
    </div>
  );
};

const HomePage = () => {
  const { user } = useUser();
  const [addPlaceMode, setAddPlaceMode] = useState(false); // Tryb dodawania miejsca
  const [editPlaceMode, setEditPlaceMode] = useState(false); // Tryb edycji miejsca
  const [newPlacePosition, setNewPlacePosition] = useState(null); 
  const [selectedPlace, setSelectedPlace] = useState(null); 
  const [places, setPlaces] = useState([]);

  const toggleAddPlaceMode = () => {
    setAddPlaceMode((prevMode) => !prevMode);
    setSelectedPlace(null);
    setEditPlaceMode(false); // Wyłączenie trybu edycji
    setNewPlacePosition(null);
  };

  const handleMapClick = (position) => {
    setSelectedPlace(null);
    if (addPlaceMode) {
      setNewPlacePosition(position);
    }
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setEditPlaceMode(false); // Wyłączenie trybu edycji
  };

  const handleEditPlace = () => {
    setEditPlaceMode((prevMode) => !prevMode);
    setAddPlaceMode(false); // Wyłączenie trybu dodawania
  };

  // Funkcja do pobierania lokalizacji
  const handleGetAll = async () => {
    try {
      const token = Cookies.get('accessTokenFront');
      const response = await axios.get('http://localhost:8080/api/places', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const locations = response.data;
      setPlaces(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }

  };

  useEffect(() => {
    const gameId = localStorage.getItem("gameId");

    if (!gameId) {
      localStorage.removeItem("gameId");
    }
    handleGetAll();
    
  }, []);
  
  const handleDeletePlace = async () => {
    if (selectedPlace) {
      const confirmation = window.confirm(`Czy na pewno chcesz usunąć miejsce: ${selectedPlace.name}?`);
      if (!confirmation) return;
  
      try {
        const token = Cookies.get('accessTokenFront');
        await axios.delete(`http://localhost:8080/api/map/places/${selectedPlace.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('Place deleted successfully.');
        window.location.reload();
  
        setSelectedPlace(null);  // Wyczyść zaznaczone miejsce
  
      } catch (error) {
        console.error('Error deleting place:', error);
      }
    }
  };

  // Funkcja do obsługi dodania miejsca
  const handleAddPlace = async (placeData) => {
    if (!newPlacePosition) {
      console.error("No place selected.");
      return;
    }
  
    const { name, description, moreInfoLink, selectedMap } = placeData;
    
    // Tworzenie obiektu do wysłania jako JSON
    const payload = {
      name,
      description,
      moreInfoLink,
      latitude: newPlacePosition.lat,
      longitude: newPlacePosition.lng,
      routeId: selectedMap.id // Przesyłamy cały obiekt mapy
    };

  
    try {
      const token = Cookies.get('accessTokenFront'); 
      const response = await axios.post('http://localhost:8080/api/map/places/add', payload, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Nagłówek autoryzacyjny
        },
      });
      
      console.log(response, payload);
      alert(`Dodano nowe miejsce: ${payload.name}`);
      setAddPlaceMode(false);
      setNewPlacePosition(null);
      window.location.reload();

  } catch (error) {
    console.error("Error during adding new place: ", error);
  }
  };

  //funkcja asynchroniczna mająca przekazać otrzymane dane (placeData)
  const handleUpdatePlace = async (placeData) => {
    const { name, description, moreInfoLink, selectedMap } = placeData;
    //payload to DTO (obiekt danych), który ma być zaktualizowany na serwerze
    const payload = { 
      name,
      description,
      moreInfoLink,
      latitude: selectedPlace.latitude,
      longitude: selectedPlace.longitude,
      routeId: selectedMap.id
    };
    try {
      const token = Cookies.get('accessTokenFront');
      const response = await axios.put(`http://localhost:8080/api/map/places/${selectedPlace.id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Place updated successfully:', response.data);
      setSelectedPlace(null);
      setEditPlaceMode(false);
      window.location.reload();
    } catch (error) {
      console.error('Error during updating place:', error);
    }
  };

  const postVisitedPlace = async (place) => {
    
    const token = Cookies.get('accessTokenFront');
    const response = await axios.post("http://localhost:8080/api/messages/send", {}, {
      headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
  };

  const handleVisitedPlace = (place) =>  {
    try{
      const responseMessage = postVisitedPlace(place);
      console.log("Message from server: ", responseMessage);
    }catch (e){
      console.error("Error during adding visited place: ", e);
    }
    
    alert(`Odwiedziłeś ${place.name}.`);
  };

  return (
    <div className="AppContent">
      
      <Sidebar />
      <div style={{marginTop:"10vh"}} />
        {/* Komponent mapy */}
        <BasicMap
          addPlaceMode={addPlaceMode}
          onMapClick={handleMapClick}
          newPlacePosition={newPlacePosition}
          onPopupClick={handlePlaceSelect}
          places={places}
          onPlaceVisit={handleVisitedPlace}

        />
      
      <div>
        <button
          className="btn-primary"
          onClick={toggleAddPlaceMode}
          style={{
            marginTop: '15px',
            padding: '10px 15px',
            backgroundColor: addPlaceMode ? 'red' : '#2F7A7E',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          {addPlaceMode ? 'Anuluj' : 'Dodaj miejsce'}
        </button>
        {selectedPlace && (
          <div style={{ marginTop: '15px'}}>
            <button 
            className="btn-secondary" 
            onClick={handleEditPlace}
            style={{
              marginTop: '15px',
              padding: '10px 15px',
              backgroundColor: addPlaceMode ? 'red' : '#2F7A7E',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
            }}
            >
            {editPlaceMode ? 'Anuluj' : 'Edytuj miejsce'} 
            </button>
            <button
             className="btn-danger"
             onClick={handleDeletePlace}
             style={{
              margin: '15pt 0 0 10pt',
              padding: '10px 15px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              }}
            >
              Usuń miejsce
            </button>
          </div>
        )}
      </div>

      <div className="right-container">
        <MiniStats />
        
      <div className="bottom-right-container"
        style={{
          display: addPlaceMode || editPlaceMode ? 'block' : 'none',
        }}
      >
        {addPlaceMode && (
          <PlaceForm
            onSubmit={handleAddPlace}
            position={newPlacePosition}
            onClose={() => setNewPlacePosition(null)}
          />
        )}
        {editPlaceMode && selectedPlace && (
          //poniższe propsy customowe, nie wbudowane w Reacta
          <PlaceForm
            onSubmit={handleUpdatePlace} //funkcja obsługująca propsa o nazwie onSubmit, w obecnej konwencji odpowiada on za obsługę formularza przy jego wysyłaniu
            placeData={selectedPlace}
            onClose={() => setSelectedPlace(null)}
          />
        )}
      </div>
      </div>
    </div>
  );
};

export default HomePage;

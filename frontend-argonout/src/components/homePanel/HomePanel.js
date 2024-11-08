import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from 'axios';

import Sidebar from "../sidebar/Sidebar";
import BasicMap from "./map/basicMap";
import { useUser } from '../userProfile/UserContext';
import './homePanel.css';

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
    fetchMaps();
  }, []);

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

  const handleMapChange = (e) => {
    const selectedMapId = e.target.value;
    const map = maps.find((m) => m.id === selectedMapId);
    setSelectedMap(map);
  };

  return (
    <div className="add-place-form">
      <h3>{placeData ? 'EDYTUJ MIEJSCE' : 'DODAJ NOWE MIEJSCE'}</h3>
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
    console.log('Payload:', JSON.stringify(payload, null, 2));

  
    try {
      const token = Cookies.get('accessTokenFront'); 
      const response = await axios.post('http://localhost:8080/api/map/places/add', payload, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Nagłówek autoryzacyjny
        },
      });
      
      console.log('New place added succesfully: ', response.data);
      
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

  return (
    <div className="AppContent">
      <Sidebar />
      <div className="top-container">
      <div className="right-top-container">
          <div className="right-top-item">
            <div className="d-flex align-items-center">
              <img src="/icons/star_8605046.png" alt="Icon" className="points-icon" />
              <span>LICZBA PUNKTÓW</span>
              <div className="points">900</div>
            </div>
          </div>
          <div className="right-top-item">
            <div className="top-row">
              <div className="first-element">
                <span>{user?.role === 'USER' ? 'Srebrna Liga' : 'Inna Liga'}</span>
              </div>
              <div className="second-element">
                <Link to="/api/leaderboard" className="leaderboard-link">Pokaż ranking</Link>
              </div>
            </div>
            <div className="third-element">
              <span>Zdobyłeś w tym miesiącu 99 XP</span>
            </div>
          </div>
        </div>
        </div>

        {/* Komponent mapy */}
      <div className="bottom-container">
        <BasicMap
          addPlaceMode={addPlaceMode}
          onMapClick={handleMapClick}
          newPlacePosition={newPlacePosition}
          onPopupClick={handlePlaceSelect}
        />
      </div>
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
  );
};

export default HomePage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from 'axios';


import Sidebar from "../sidebar/Sidebar";
import BasicMap from "./map/basicMap";
import { useUser } from '../userProfile/UserContext';
import './homePanel.css';

// Komponent formularza dodawania miejsca
const AddPlaceForm = ({ position, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedRoute: '',
    moreInfoLink: ''
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
  const [selectedMap, setSelectedMap] = useState(null); // Stan do przechowywania wybranej mapy
   
  // Funkcja do pobierania map z API
   const fetchMaps = async () => {
    try {
      const token = Cookies.get('accessTokenFront')
      const response = await axios.get('http://localhost:8080/api/routes/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // Endpoint do pobrania map
      setMaps(response.data); // Ustawienie stanu na pobrane dane
    } catch (error) {
      console.error('Error during routes fetching: ', error);
    }
  };

  // Użycie useEffect do załadowania map po zamontowaniu komponentu
  useEffect(() => {
    fetchMaps();
  }, []);

  // Funkcja do obsługi zmiany wybranej mapy
  const handleMapChange = (e) => {
    const selectedMapId = e.target.value;
    const map = maps.find((m) => m.id === selectedMapId); // Znajdź cały obiekt mapy na podstawie ID
    
    setSelectedMap(map); // Zapisz cały obiekt mapy, nie tylko ID
  };

  return (
    <div className="add-place-form">
      <h3>DODAJ NOWE MIEJSCE</h3>
      {position && (
        <p>Nowe miejsce będzie dodane w lokalizacji: {`(${position.lat}, ${position.lng})`}</p>
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
        <input
                className="text-input"
                type="text"
                name="description"
                placeholder="Opis"
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
              {maps.map((map) => ( // Renderowanie opcji na podstawie pobranych danych
                <option key={map.id} value={map.id}> {/* Zakładamy, że każdy obiekt mapy ma unikalne 'id' */}
                  {map.name} {/* Zakładamy, że każdy obiekt mapy ma pole 'name' */}
                </option>
              ))}
            </select>
            <br/>
        <button type="submit" className="btn btn-secondary">Dodaj miejsce</button>
      </form>
    </div>
  );
};

const HomePage = () => {
  const { user } = useUser();
  const [addPlaceMode, setAddPlaceMode] = useState(false); // Stan do zarządzania trybem dodawania miejsca
  const [newPlacePosition, setNewPlacePosition] = useState(null); // Pozycja nowego miejsca

  // Funkcja do przełączania trybu dodawania miejsca
  const toggleAddPlaceMode = () => {
    setAddPlaceMode((prevMode) => !prevMode);
  };

  // Funkcja do obsługi kliknięcia na mapie i ustawienia pozycji nowego miejsca
  const handleMapClick = (position) => {
    if (addPlaceMode) {
      setNewPlacePosition(position);
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
      const response = await axios.post('http://localhost:8080/api/map/add-location', payload, {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Nagłówek autoryzacyjny
        },
      });
      
      console.log('New place added succesfully: ', response.data);
      
      setAddPlaceMode(false);
      setNewPlacePosition(null);

  } catch (error) {
    console.error("Error during adding new place: ", error);
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
          newPlacePosition={newPlacePosition} // Przekazanie pozycji do komponentu mapy
        />
        </div>
        <div>
          {/* Przycisk do przełączania trybu dodawania miejsca */}
          <button
          className="btn-primary"
            onClick={toggleAddPlaceMode}
            style={{
              marginTop: '15px',
              padding: '10px 15px',
              backgroundColor: addPlaceMode ? 'red' : 'green',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            {addPlaceMode ? 'Anuluj' : 'Dodaj miejsce'}
          </button>
        </div>

        {/* Formularz dodawania miejsca poniżej mapy */}
        <div className="bottom-right-container"
          style={{
            display: addPlaceMode ? 'block' : 'none', // Ustawienie stylu 'display' w zależności od warunków
          }}
        >
        {addPlaceMode && (
          <AddPlaceForm
            position={newPlacePosition}
            onSubmit={handleAddPlace}
            onClose={() => setNewPlacePosition(null)}
          />
        )}
        </div>
    </div>
  );
};

export default HomePage;

import React, { useState } from "react";
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
    moreInfoLink: '',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="add-place-form">
      <h3>Dodaj nowe miejsce</h3>
      {position && (
        <p>Nowe miejsce będzie dodane w lokalizacji: {`(${position.lat}, ${position.lng})`}</p>
      )}
      <form onSubmit={handleSubmit} className="place-form">
        <div>
          <label>Nazwa:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Opis:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Link do strony:</label>
          <input
            type="url"
            name="moreInfoLink"
            value={formData.moreInfoLink}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Zdjęcie:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Dodaj miejsce</button>
        <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Anuluj</button>
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
      console.error("Brak pozycji miejsca do dodania.");
      return;
    }
  
    const { name, description, moreInfoLink, image } = placeData;
  
    // Tworzenie obiektu formularza, aby wysłać dane, w tym plik obrazu, do backendu.
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("moreInfoLink", moreInfoLink);
    formData.append("latitude", newPlacePosition.lat); // Dodaj współrzędne
    formData.append("longitude", newPlacePosition.lng); // Dodaj współrzędne
    if (formData.image) {  // użycie image z formData
      formData.append("image", formData.image);  // użycie formData.image
  }
  
    try {
      const token = Cookies.get('accessTokenFront'); // Pobranie tokenu autoryzacyjnego, jeśli jest wymagany.
      
      // Wysłanie danych do backendu.
      const response = await axios.post('http://localhost:8080/api/map/add-location', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Nagłówek dla formData
          Authorization: `Bearer ${token}`, // Nagłówek autoryzacyjny
        },
      });
  
      console.log('Dane miejsca zostały pomyślnie dodane:', response.data);
      
      setAddPlaceMode(false);
      setNewPlacePosition(null);

  } catch (error) {
    console.error("Wystąpił błąd podczas dodawania nowego miejsca:", error);
  }
  };

  return (
    <div className="AppContent">
      <div className="main-content">
        <Sidebar />
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

        {/* Komponent mapy */}
        <BasicMap
          addPlaceMode={addPlaceMode}
          onMapClick={handleMapClick}
          newPlacePosition={newPlacePosition} // Przekazanie pozycji do komponentu mapy
        />
        
        {/* Przycisk do przełączania trybu dodawania miejsca */}
        <button
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

        {/* Formularz dodawania miejsca poniżej mapy */}
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

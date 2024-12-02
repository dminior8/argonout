import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from 'axios';

import Sidebar from "../../sidebar/Sidebar";
import BasicMap from "../../map/BasicMap";
import { useUser } from '../../../contexts/UserContext';
import './routeEditorPanel.css';
import MiniStats from "../../miniStats/MiniStats";

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
        <div style={{fontSize:"0.7rem", display:"flex", flexDirection:"row"}} >
            <div style={{}}>Lokalizacja:</div>
            <div style={{textAlign:"right"}}>{`${position.lat}, ${position.lng}`}</div>
            
        </div>
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

const RouteEditorPanel = () => {
  const [addPlaceMode, setAddPlaceMode] = useState(false); // Tryb dodawania miejsca
  const [editPlaceMode, setEditPlaceMode] = useState(false); // Tryb edycji miejsca
  const [newPlacePosition, setNewPlacePosition] = useState(null); 
  const [selectedPlace, setSelectedPlace] = useState(null); 
  const [places, setPlaces] = useState([]);
  const [qrCodeImage, setQrCodeImage] = useState(null);

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

  const handleQrButton = () => {
    if(addPlaceMode || editPlaceMode) return;
    handleGetQRCode();
  }

  const handleGetQRCode = async () => {
    if (!selectedPlace) {
      console.error("No place selected.");
      return;
    }
  
    try {
      const token = Cookies.get('accessTokenFront');
      const response = await axios.get(`http://localhost:8080/api/qrcode/generate/${selectedPlace.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Ustalamy odpowiedź jako blob (obrazek)
      });
  
      // Używamy FileReader do konwersji blob na base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1]; // Zbieramy tylko część base64
        setQrCodeImage(base64Image);
      };
  
      // Przekazujemy blob do FileReader
      reader.readAsDataURL(response.data);
    } catch (error) {
      console.error('Error fetching QR Code:', error);
    }
  };

  useEffect(() => {
    handleGetQRCode();
  },[selectedPlace]);

  return (
    <div className="AppContent">
      
      <Sidebar />
      <div style={{marginTop:"10vh"}} />
        
        <div className="map-container">
          <BasicMap
            className="basic-map" 
            addPlaceMode={addPlaceMode}
            onMapClick={handleMapClick}
            newPlacePosition={newPlacePosition}
            onPopupClick={handlePlaceSelect}
            places={places}

          />
        </div>
      
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={toggleAddPlaceMode}
            style={{
              padding: '10px 15px',
              backgroundColor: addPlaceMode ? 'red' : '#2F7A7E',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginTop: "10px",
              flex: '1 0 auto', // Zapewnia elastyczność przycisków
            }}
            display={editPlaceMode ? "none" : "block"}
          >
            {addPlaceMode ? 'Anuluj' : 'Dodaj miejsce'}
          </button>
          
          {selectedPlace && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                className="btn-secondary"
                onClick={handleEditPlace}
                style={{
                  padding: '10px 15px',
                  backgroundColor: editPlaceMode ? 'red' : '#2F7A7E',
                  marginTop: "10px",
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  flex: '1 0 auto', // Zapewnia elastyczność przycisków
                }}
              >
                {editPlaceMode && !addPlaceMode ? 'Anuluj' : 'Edytuj miejsce'}
              </button>
              
              <button
                className="btn-danger"
                onClick={handleDeletePlace}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#2F7A7E',
                  color: 'white',
                  marginTop: "10px",
                  border: 'none',
                  borderRadius: '5px',
                  flex: '1 0 auto', // Zapewnia elastyczność przycisków
                }}
                display={editPlaceMode ? "none" : "block"}
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

      <div style={{ marginLeft: '20px', width: '30%' }}>
          {(qrCodeImage  && (selectedPlace != null) && (!editPlaceMode && !addPlaceMode) ) && (
            <div style={{ right: 0, bottom: 0, position: "absolute" }}>
              <div style={{color:"#389ba0", fontWeight:"bold", marginBottom: "10px", fontSize:"14px"}}>Kod QR dla {selectedPlace.name}</div>
              <img
                src={`data:image/png;base64,${qrCodeImage}`}
                alt="QR Code"
                style={{ width: '200px', height: "200px" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteEditorPanel;

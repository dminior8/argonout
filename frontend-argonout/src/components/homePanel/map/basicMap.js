import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from "react-leaflet";
import L, { Icon } from 'leaflet';
import axios from 'axios';
import Cookies from 'js-cookie';
import osm from "./osm-providers";
import './basicMap.css';
import 'leaflet/dist/leaflet.css';

// Ikona niestandardowa
const customIcon = new Icon({
  iconUrl: process.env.PUBLIC_URL + '/icons/mapMarkersImages/marker.png',
  iconSize: [50, 50],
  iconAnchor: [12, 41],
  popupAnchor: [8, -34],
});

const blueOptions = { color: 'blue' };

// Ustawienia domyślnej ikony
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

// Komponent do lokalizacji użytkownika
function LocationMarker() {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Circle
      center={position}
      pathOptions={blueOptions}
      radius={100}
    >
      <Popup>Tu jesteś!</Popup>
    </Circle>
  );
}

// Komponent nasłuchujący na kliknięcia na mapie w trybie dodawania miejsca
const MapClickHandler = ({ addPlaceMode, onMapClick }) => {
  useMapEvents({
    click(e) {
      if (addPlaceMode) {
        onMapClick(e.latlng); // Ustaw pozycję nowego miejsca
      }
    },
  });

  return null;
};

// Główny komponent mapy
const BasicMap = ({ addPlaceMode, onMapClick, newPlacePosition, onPopupClick }) => {
  const ZOOM_LEVEL = 12;
  const [center, setCenter] = useState({ lat: 50.05931, lng: 19.94251 });
  const [places, setCoordinates] = useState([]);

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
      setCoordinates(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    handleGetAll();
  }, []);

  const handlePopupClick = (markerData) => {
    if (onPopupClick) {
      onPopupClick(markerData); // Wywołanie funkcji przekazanej z komponentu nadrzędnego
    }
  };

  return (
    <MapContainer center={center} zoom={ZOOM_LEVEL} scrollWheelZoom={false} className="rounded-map">
      <TileLayer
        url={osm.maptiler.url}
        attribution={osm.maptiler.attribution}
      />
      {/* Renderowanie istniejących miejsc */}
      {places.map((markerData, index) => (
        <Marker 
        key={index} 
        position={[markerData.latitude, markerData.longitude]} 
        icon={customIcon}
        eventHandlers={{
          click: () => {
            handlePopupClick(markerData); // Funkcja obsługująca kliknięcie na markerze
          },
        }}
      >
          <Popup>
            <div className="popupContainer" >
              <h5>{markerData.name}</h5>
              <p>{markerData.description}</p>
              <a href={markerData.moreInfoLink}>Kliknij po więcej informacji</a>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Renderowanie znacznika dodawanego miejsca */}
      {newPlacePosition && (
        <Marker position={newPlacePosition} icon={customIcon}>
          <Popup>
            <div>
              <h4>Nowe miejsce</h4>
              <p>Uzupełnij formularz dodając szczegóły.</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Nasłuchiwacz kliknięć na mapie */}
      <MapClickHandler addPlaceMode={addPlaceMode} onMapClick={onMapClick} />
      <LocationMarker />
    </MapContainer>
  );
};

export default BasicMap;

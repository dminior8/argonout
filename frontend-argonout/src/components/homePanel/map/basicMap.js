import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { useMapEvents } from "react-leaflet";
import L from 'leaflet';
import { Icon } from 'leaflet';
import axios from 'axios';
import Cookies from 'js-cookie'; // Upewnij się, że ten import jest w Twoim kodzie
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
      <Popup>Your location</Popup>
    </Circle>
  );
}

// Główny komponent mapy
const BasicMap = () => {
  const ZOOM_LEVEL = 12;
  const [center, setCenter] = useState({ lat: 50.05931, lng: 19.94251 });
  const [places, setCoordinates] = useState([]);

  // Funkcja do pobierania lokalizacji
  const handleGetAll = async () => {
    try {
      const token = Cookies.get('accessTokenFront');
      const response = await axios.get('http://localhost:8080/api/map/all-locations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const locations = response.data;
      // Zakładam, że dane mają format odpowiedni do użycia jako współrzędne
      setCoordinates(locations); // Zaktualizuj stan z pobranymi danymi
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Użyj useEffect do wywołania funkcji pobierania danych
  useEffect(() => {
    handleGetAll();
  }, []); // Pusty array oznacza, że efekt uruchomi się tylko raz, po zamontowaniu komponentu

  return (
    <MapContainer center={center} zoom={ZOOM_LEVEL} scrollWheelZoom={false} className="rounded-map">
      <TileLayer
        url={osm.maptiler.url}
        attribution={osm.maptiler.attribution}
      />
      {places.map((markerData, index) => (
        <Marker key={index} position={[markerData.latitude, markerData.longitude]} icon={customIcon}>
          <Popup>
            <div className="popupContainer">
              <h5>{markerData.name}</h5>
              <img src={process.env.PUBLIC_URL + '/icons/mapMarkersImages' + markerData.imageUrl} alt="Monument photo" />
              <p>{markerData.description}</p>
              <a href={markerData.moreInfoLink}>Click for more info</a>
            </div>
          </Popup>
        </Marker>
      ))}
      <LocationMarker />
    </MapContainer>
  );
};

export default BasicMap;

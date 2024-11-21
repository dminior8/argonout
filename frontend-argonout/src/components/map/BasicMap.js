import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from "react-leaflet";
import L, { Icon } from 'leaflet';
import osm from "./osm-providers";
import './basicMap.css';
import 'leaflet/dist/leaflet.css';

// Ikony niestandardowe
const customIcon = new Icon({
  iconUrl: process.env.PUBLIC_URL + '/icons/mapMarkersImages/marker.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
});

const visitedIcon = new Icon({
  iconUrl: process.env.PUBLIC_URL + '/icons/mapMarkersImages/visited-marker.png',
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50],
});

const blueOptions = { color: 'blue' };

// Ustawienia domyślnej ikony Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Komponent do lokalizacji użytkownika
function LocationMarker({ places, setNearbyPlaces, radius }) {
  const [position, setPosition] = useState(null);
  const simulatedLocation = {
    lat: 50.05286484168532,
    lng: 19.93407011032105,
  };

  const map = useMapEvents({
    locationfound() {
      const userLocation = simulatedLocation;
      setPosition(userLocation);
      map.flyTo(userLocation, map.getZoom());

      const nearby = places.filter(place => {
        const distance = map.distance(userLocation, L.latLng(place.latitude, place.longitude));
        return distance <= radius;
      });
      setNearbyPlaces(nearby);
    },
  });

  // Symulowane ustawienie lokalizacji
  useEffect(() => {
    map.locate();
  }, []);

  return position === null ? null : (
    <Circle center={position} pathOptions={blueOptions} radius={radius}>
      <Popup>Tu jesteś!</Popup>
    </Circle>
  );
}

// Komponent do obsługi kliknięć na mapie
const MapClickHandler = ({ addPlaceMode, onMapClick }) => {
  useMapEvents({
    click(e) {
      if (addPlaceMode) {
        onMapClick(e.latlng);
      }
    },
  });

  return null;
};

// Główny komponent mapy
const BasicMap = ({ addPlaceMode, onMapClick, newPlacePosition, onPopupClick, places, onPlaceVisit, currentPlace }) => {
  const ZOOM_LEVEL = 14;
  const radius = 100;
  const center = { lat: 50.05931, lng: 19.94251 };
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const popupRefs = useRef({}); // Referencje do popupów

  const handlePopupClick = (markerData) => {
    if (onPopupClick) {
      onPopupClick(markerData);
    }
  };

  const handleVisitedPlace = (place) => {
    onPlaceVisit(place);

    setNearbyPlaces(prev =>
      prev.map(p => (p.id === place.id ? { ...p, visited: true } : p))
    );
  };

  // Otwieranie popupu, gdy zmienia się `currentPlace`
  useEffect(() => {
    if (currentPlace && popupRefs.current[currentPlace]) {
      popupRefs.current[currentPlace].openPopup();
    }
  }, [currentPlace]);

  return (
    <MapContainer
      center={center}
      zoom={ZOOM_LEVEL}
      scrollWheelZoom={true}
      className="rounded-map"
    >
      <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribution} />

      {/* Renderowanie markerów */}
      {places.map((markerData, index) => (
        <Marker
          key={`${markerData.placeId}-${index}`} 
          position={[markerData.latitude, markerData.longitude]}
          icon={nearbyPlaces.some(p => p.id === markerData.id && p.visited) ? visitedIcon : customIcon}
          ref={(el) => (popupRefs.current[markerData.placeId] = el)}
          eventHandlers={{
            click: () => handlePopupClick(markerData),
          }}
        >
          <Popup>
            <div className="popupContainer">
              <h5>{markerData.name}</h5>
              <p>{markerData.description}</p>
              <a href={markerData.moreInfoLink}>Kliknij po więcej informacji</a>
              <br />
              {nearbyPlaces.some(p => p.id === markerData.id && !p.visited) && (
                <button  className="btn-start" onClick={() => handleVisitedPlace(markerData)}>
                  Kliknij aby odwiedzić
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Nowe miejsce */}
      {newPlacePosition && (
        <Marker position={newPlacePosition} icon={customIcon}>
          <Popup>
            <div>
              <h4>Nowe miejsce</h4>
              <p>Uzupełnij szczegóły w formularzu.</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Obsługa kliknięć na mapie */}
      <MapClickHandler addPlaceMode={addPlaceMode} onMapClick={onMapClick} />

      {/* Lokalizacja użytkownika */}
      <LocationMarker places={places} setNearbyPlaces={setNearbyPlaces} radius={radius} />
    </MapContainer>
  );
};

export default BasicMap;

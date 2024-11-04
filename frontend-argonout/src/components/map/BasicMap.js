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
function LocationMarker({places, setNearbyPlaces, radius}) {
  const [position, setPosition] = useState(null);
  const [simulatedLocation, setSimulatedLocation] = useState({
    lat: 50.06339626,
    lng: 20.01931608,
  });

  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      const userLocation = simulatedLocation;
      setPosition(userLocation);
      map.flyTo(userLocation, map.getZoom());

      const nearby = places.filter(place => {
        const placeLatLng = L.latLng(place.latitude, place.longitude);
        const distance = map.distance(userLocation, placeLatLng);
        return distance <= radius;
      });
      setNearbyPlaces(nearby.map(place => place.id));

    },
  });

  // Ręczne wywołanie symulowanej lokalizacji
  useEffect(() => {
    if (simulatedLocation) {
      setPosition(simulatedLocation);
      map.flyTo(simulatedLocation, map.getZoom());
    }
  }, [simulatedLocation, map]);

  return position === null ? null : (
    <Circle
      center={position}
      pathOptions={blueOptions}
      radius={radius}
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
const BasicMap = ({ addPlaceMode, onMapClick, newPlacePosition, onPopupClick, places, onPlaceVisit }) => {
  const ZOOM_LEVEL = 14;
  //const [places, setPlaces] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const radius = 100;
  const center = ({ lat: 50.05931, lng: 19.94251 });

  const handlePopupClick = (markerData) => {
    if (onPopupClick) {
      onPopupClick(markerData); // Wywołanie funkcji przekazanej z komponentu nadrzędnego
    }
    console.log("MIEJSCA W MAPIE: ", places);
  };

  const handleVisitedPlace = (place) => { //////////////////////////////COŚ TU POROBIĆ, BO PO ODŚWIEŻENIU POWRÓCI DO STANU WCZEŚNIEJSZEGO (false), chyba trzeba od razu POST API
    onPlaceVisit(place);
    setNearbyPlaces(prevNearbyPlaces =>
      prevNearbyPlaces.map(p =>
        p.id === place.id ? { ...p, visited: true } : p
      ).filter(p => !p.visited)
    );
  };

  return (
    <MapContainer center={center} zoom={ZOOM_LEVEL} scrollWheelZoom={true} className="rounded-map">
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
              <br/>
              {/* Sprawdzenie, czy dane miejsce jest w pobliżu i dodanie przycisku */}
              {(nearbyPlaces.includes(markerData.id) && nearbyPlaces.filter(f => f.visited === false)) && (
                <button onClick={() => handleVisitedPlace(markerData)}>
                  Jestem w pobliżu!
                </button>
              )}
            </div>
          </Popup>
        </Marker>
        
      )
      )}


      {/* Renderowanie znacznika dodawanego miejsca */}
      {newPlacePosition && (
        <Marker position={newPlacePosition} icon={customIcon}>
          <Popup>
            <div>
              <h4>Nowe miejsce</h4>
              <p>Uzupełnij formularz dodając szczegóły.{console.log("Miejsce: ", places)}</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Nasłuchiwacz kliknięć na mapie */}
      <MapClickHandler addPlaceMode={addPlaceMode} onMapClick={onMapClick} />
      <LocationMarker places={places} setNearbyPlaces={setNearbyPlaces} radius={radius}/>
    </MapContainer>
  );
};

export default BasicMap;

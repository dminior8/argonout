import React, { useEffect, useState, useContext } from "react";
import Form from 'react-bootstrap/Form';
import Cookies from "js-cookie";
import axios from 'axios';

import Sidebar from "../sidebar/Sidebar";
import BasicMap from "../map/BasicMap";
import MiniStats from "../miniStats/MiniStats";
import Timer from "./Timer";
import { useGameStatus } from '../../contexts/GameContext';

import "./adventureModePanel.css";

const AdventureModePanel = () => {
  const [routes, setRoutes] = useState([]);
  const [places, setPlaces] = useState([]);
  
  const { 
    gameStatus, handleGameStatus, 
    timeToEnd, handleTimeToEnd, 
    selectedRoute, handleSelectedRoute 
  } = useGameStatus();

    useEffect(() => {
      const fetchRoutes = async () => {
        try {
          const token = Cookies.get('accessTokenFront');
          const response = await axios.get('http://localhost:8080/api/routes/all', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setRoutes(response.data);
          
          //Po załadowaniu danych (bo [] na końcu useEffect) 
          const savedRouteId = localStorage.getItem("routeId");
          if (savedRouteId) {
            const savedRoute = response.data.find((route) => route.id === savedRouteId);
            if (savedRoute) {
              handleSelectedRoute(savedRoute);
              handleTimeToEnd(localStorage.getItem("timeToEnd")/60);
            }
          }
        } catch (error) {
          console.error('Error during routes fetching: ', error);
        }
      };
      fetchRoutes();
    }, []);
  
    useEffect(() => {
      const fetchPlaces = async () => {
        try {
          const savedRouteId = localStorage.getItem("routeId");
          if(savedRouteId){
            const token = Cookies.get('accessTokenFront');
            const response = await axios.get(`http://localhost:8080/api/places/${savedRouteId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setPlaces(response.data);
          }
        } catch (error) {
          console.error('Error during places fetching: ', error);
        }
      };
      fetchPlaces();
    },[selectedRoute]);
 
  
  const handleRouteChange = (event) => {
    const selectedRouteId = event.target.value; // route.id, które jest w <option value= 
    if (gameStatus) {
      handleGameStatus();
    }
    const route = routes.find((r) => r.id === selectedRouteId);

    if (selectedRouteId === "default") {
      handleSelectedRoute(null);
      return;
    }
    
    
    if (route && route.maxTime) {
      handleTimeToEnd(route.maxTime);
    } 
    handleSelectedRoute(route); 
  };

  const postVisitedPlace = async (place) => {
    const gameId = localStorage.getItem("gameId");
    
    const token = Cookies.get('accessTokenFront');
    const response = await axios.post(`http://localhost:8080/api/game/${gameId}/add-place/${place.id}`, {}, {
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
    
    setPlaces((prevPlaces) =>
      prevPlaces.map((p) => (p.id === place.id ? { ...p, visited: true } : p))
    );
    alert(`Odwiedziłeś ${place.name}.`);
  };

  return (
    <div className="AppContent">
      <Sidebar />
      
      <div className="map-container">
        {/* Komponent mapy */}
        <BasicMap
          places={places}
          onPlaceVisit={handleVisitedPlace}
        />
      </div>
      <div className="right-container">
        <MiniStats className="right-top-container" />
        
        <div className="game-container">
          <div className="route-title" style={{color:"#D1D1D1"}}>
            TRYB WYZWANIA
          </div>

          <div className="route-title">
            {selectedRoute ? selectedRoute.name : '- wybierz trasę'}
          </div>

          <div className="route-description">
            {selectedRoute ? selectedRoute.description : ''}
          </div>

          <div className="route-max-time">
            {selectedRoute ? 'Czas na wykonanie: ' : ''} 
            <b>{selectedRoute ? `${selectedRoute.maxTime} minut` : ''}</b>
          </div>

          {gameStatus || (selectedRoute && selectedRoute.maxTime) ? <Timer value={timeToEnd} className="timer" /> : ''}

          {!gameStatus && (
            <Form.Select
              className="form-select"
              aria-label="Routes select"
              value={selectedRoute ? selectedRoute.id : 'default'}
              onChange={handleRouteChange}
            >
              <option value="default" disabled={!routes.length}>Wybierz trasę</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Form.Select>
          )}

          <div>
            {(selectedRoute || gameStatus) && (
              <button className="btn-start" onClick={handleGameStatus}>
                {gameStatus ? 'Koniec gry' : 'Rozpocznij grę'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
);

};

export default AdventureModePanel;

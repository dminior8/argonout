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
  
  const { //Odwołanie do kontekstu
    gameStatus, handleGameStatus, 
    timeToEnd, handleTimeToEnd, 
    selectedRoute, handleSelectedRoute 
  } = useGameStatus();

  // const fetchRoutes = async (token) => {
  //     const response = await axios.get('http://localhost:8080/api/routes/all', {
  //       headers: { Authorization: `Bearer ${token}`}
  //     });
  //     return response.data;
  //   };


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

  const handleVisitedPlace = (place) => {
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
      <div className="top-container">
        <div style={{ marginTop: "30pt", textAlign: "center", display: "flex", fontSize: "30pt", fontWeight: "bold", justifyContent: "center", color: "#72FFE6" }}>
          <div style={{ color: "#d6f0fa", float: "left", textAlign: "center", marginRight: "10pt" }}>TRYB </div>
          <div style={{ color: "#72FFE6", float: "left", textAlign: "center", marginRight: "10pt" }}>WYZWANIA</div>
          <div style={{ color: "#d6f0fa", float: "left", textAlign: "center" }} className="route-title">
            {selectedRoute ? selectedRoute.name : '- wybierz trasę'}
          </div>
        </div>
        <div className="row" style={{ textAlign: "center", color: "#FFFFFF", fontSize: "12pt", marginBottom: "20pt" }}>
          <div style={{ marginBottom: "5pt" }} className="route-description">
            {selectedRoute ? selectedRoute.description : ''} 
          </div>
          <div className="route-max-time">
          {selectedRoute ? `Czas na wykonanie: ` : ''} <b>{selectedRoute ? `${selectedRoute.maxTime} minut` : ''}</b>
          </div>
          {gameStatus || (selectedRoute && selectedRoute.maxTime) ? <Timer value={timeToEnd} /> : ''}

          {gameStatus ? '' :
          <Form.Select
            style={{ maxWidth: "200pt", margin: "10pt auto 5pt auto", display: "block" }}
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
          }

          <div>
            {selectedRoute || gameStatus ? (
              <button className="btn-start" onClick={handleGameStatus}>{gameStatus ? 'Koniec gry' : 'Rozpocznij grę'}</button>) : ''}
          </div>
        </div>
      </div>
      <Sidebar />
      <BasicMap places={places} onPlaceVisit={handleVisitedPlace}/>
      <div style={{marginBottom: '30pt'}}></div>
      <MiniStats />
    </div>
  );
};

export default AdventureModePanel;

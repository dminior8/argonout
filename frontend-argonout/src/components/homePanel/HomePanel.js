import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from 'axios';

import Sidebar from "../sidebar/Sidebar";
import BasicMap from "../map/BasicMap";
import './homePanel.css';
import MiniStats from "../miniStats/MiniStats";

const HomePage = () => {
  const [places, setPlaces] = useState([]);

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

  const postVisitedPlace = async (place) => {
    
    const token = Cookies.get('accessTokenFront');
    const response = await axios.post("http://localhost:8080/api/messages/send", {}, {
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
    
    alert(`Odwiedziłeś ${place.name}.`);
  };

  return (
    <div className="AppContent">
      
      <Sidebar />
      <div style={{marginTop:"10vh"}} />
        {/* Komponent mapy */}
        <BasicMap
          places={places}
          onPlaceVisit={handleVisitedPlace}

        />

      <div className="right-container">
        <MiniStats />
        
      </div>
    </div>
  );
};

export default HomePage;

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";

const GameContext = createContext();

// Provider dla kontekstu
export const GameProvider = ({ children }) => {
  const [timeToEnd, setTimeToEnd] = useState(() => {
    const savedTime = localStorage.getItem('timeToEnd');
    return savedTime !== null ? parseInt(savedTime, 10) : null;
  });

  const [gameStatus, setGameStatus] = useState(() => {
    const savedGameStatus = localStorage.getItem('gameStatus');
    return savedGameStatus === 'true'; 
  });

  const [selectedRoute, setSelectedRoute] = useState(() => {
    const routeId = localStorage.getItem('routeId'); 
    return routeId !== null ? routeId : null; 
  });

  // Pomocnicza funkcja do wykonania POST z tokenem
  const postGameStatus = async (url) => {
    try {
      const token = Cookies.get('accessTokenFront');
      const response = await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas wysyłania statusu gry:', error);
      throw error;
    }
  };

  const handleGameStatus = async () => {
    if (gameStatus) {
      const confirmation = window.confirm('Czy na pewno chcesz zakończyć grę?');
      if (!confirmation) return;
    }

    const newStatus = !gameStatus;
    setGameStatus(newStatus);
    localStorage.setItem('gameStatus', newStatus);

    if (newStatus) {
      // Rozpoczęcie gry
      if (selectedRoute && selectedRoute.id) {
        const url = `http://localhost:8080/api/game/init/${selectedRoute.id}`;
        try {
          const response = await postGameStatus(url);
          localStorage.setItem("gameId", response);
        } catch (error) {
          console.error("Błąd podczas inicjalizacji gry:", error);
        }
      }
    } else {
      // Zakończenie gry
      const gameId = localStorage.getItem("gameId");
      const url = `http://localhost:8080/api/game/${gameId}/end`;
      try {
        await postGameStatus(url);
        localStorage.removeItem("gameId");
      } catch (error) {
        console.error("Błąd podczas kończenia gry:", error);
      }
      setTimeToEnd(null);
      localStorage.removeItem('timeToEnd');
      localStorage.removeItem('routeId');
    }
  };

  const handleSelectedRoute = (route) => {
    setSelectedRoute(route);
    if (route) {
      localStorage.setItem('routeId', route.id);
    } else {
      localStorage.removeItem('routeId');
    }
  };

  const handleTimeToEnd = (time) => {
    const totalTime = time * 60; // zamiana minut na sekundy
    setTimeToEnd(totalTime);
    localStorage.setItem('timeToEnd', totalTime); 
  };

  useEffect(() => {
    let timerId;

    if (gameStatus && timeToEnd > 0) {
      timerId = setInterval(() => {
        setTimeToEnd((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            localStorage.removeItem('timeToEnd');
            setGameStatus(false); // Zakończenie gry, gdy czas się skończy
            return 0;
          }
          const newTime = prevTime - 1;
          localStorage.setItem('timeToEnd', newTime);
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [gameStatus, timeToEnd]);

  useEffect(() => {
    const savedTime = localStorage.getItem('timeToEnd');
    const savedStatus = localStorage.getItem('gameStatus');
    const savedRouteId = localStorage.getItem('routeId');

    if (savedTime !== null && savedStatus === 'true' && savedRouteId !== null) {
        setTimeToEnd(parseInt(savedTime, 10));
        setGameStatus(true);
        setSelectedRoute({ id: savedRouteId });
    } else {
        // jeśli brak statusu gry lub czasu, wyczyść dane
        localStorage.removeItem('timeToEnd');
        localStorage.removeItem('gameStatus');
        localStorage.removeItem('routeId');
    }
}, []);

  return (
    <GameContext.Provider value={{
      gameStatus,
      handleGameStatus,
      timeToEnd,
      handleTimeToEnd,
      selectedRoute,
      handleSelectedRoute
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook do korzystania z kontekstu w komponentach funkcyjnych
export const useGameStatus = () => useContext(GameContext);

import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext(); // Funkcja zwracająca parę GameContext.Provider i GameContext.Consumer

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

  const handleGameStatus = () => {
    setGameStatus((prevStatus) => {
      const newStatus = !prevStatus;
      localStorage.setItem('gameStatus', newStatus); 
      if (newStatus === false) {
        setTimeToEnd(null); 
        localStorage.removeItem('timeToEnd'); 
        localStorage.removeItem('routeId'); 
      }
      return newStatus;
    });
  };

  const handleSelectedRoute = (route) => {
    setSelectedRoute(route);
    // if (gameStatus === false) { 
    //     localStorage.removeItem('routeId');
    //     return;
    // }
    localStorage.setItem('routeId', route.id);
  };

  const handleTimeToEnd = (time) => {
    setTimeToEnd(time * 60);
    localStorage.setItem('timeToEnd', time); 
  };

  useEffect(() => {
    let timerId;

    if (gameStatus && timeToEnd > 0) {
      timerId = setInterval(() => {
        setTimeToEnd((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            localStorage.removeItem('timeToEnd');
            return 0;
          }
          const newTime = prevTime - 1;
          localStorage.setItem('timeToEnd', newTime);
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timerId); // Czyści interwał po zakończeniu gry
    }
  }, [gameStatus, timeToEnd]);

  return (
    <GameContext.Provider value={[{ gameStatus, handleGameStatus }, { timeToEnd, handleTimeToEnd }, { selectedRoute, handleSelectedRoute }]}>
      {children}
    </GameContext.Provider>
  );
};

// Hook do korzystania z kontekstu w komponentach funkcyjnych
export const useGameStatus = () => useContext(GameContext);

import React from 'react';
import { useGameStatus } from '../../contexts/GameContext';

const Timer = () => {
  const [,{timeToEnd, setTimeToEnd}] = useGameStatus(); //Odwołanie do kontekstu
  console.log('TIME TO END: ', timeToEnd)
  if (timeToEnd === null) return null;

  // Obliczenie minut i sekund z pozostałego czasu
  const formattedHours = Math.floor(timeToEnd / 3600);
  const formattedMinutes = Math.floor((timeToEnd % 3600) / 60);
  const formattedSeconds = timeToEnd % 60;

  const displayTime = `${formattedHours.toString().padStart(2, '0')}:${formattedMinutes.toString().padStart(2, '0')}:${formattedSeconds.toString().padStart(2, '0')}`;

  return (
    <div style={{ fontSize: '24pt', color: '#FFFFFF' }}>
      {displayTime}
    </div>
  );
};

export default Timer;
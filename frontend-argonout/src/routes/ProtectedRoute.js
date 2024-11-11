import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGameStatus } from '../contexts/GameContext';

const ProtectedRoute = ({ children }) => {
  const { gameStatus } = useGameStatus();

  // Jeśli gra jest aktywna, przekieruj do trybu przygody
  if (gameStatus) {
    return <Navigate to="/adventure" />;
  }

  return children;
};

export default ProtectedRoute;
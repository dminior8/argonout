import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config';
import { Alert } from 'react-native';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [timeToEnd, setTimeToEnd] = useState(null);
  const [gameStatus, setGameStatus] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const saveToStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to AsyncStorage:`, error);
    }
  };

  const getFromStorage = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value?.replace(/^"|"$/g, "") ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error retrieving ${key} from AsyncStorage:`, error);
      return null;
    }
  };

  const removeFromStorage = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from AsyncStorage:`, error);
    }
  };

  const postGameStatus = async (url, data = {}) => {
    try {
      const token = await AsyncStorage.getItem('accessTokenFront');
      if (!token) {
        throw new Error('Token is missing');
      }

      const response = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      console.log('Response data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error during game status POST:', error.response || error.message);
      throw error;
    }
  };

  const handleGameStatus = async () => {
    if (gameStatus) {
      Alert.alert(
        'Confirm',
        'Do you really want to end the game?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes',
            onPress: async () => {
              await endGame();
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      await startGame();
    }
  };

  const startGame = async () => {
    if (selectedRoute && selectedRoute.id) {
      const url = `${BASE_URL}/api/game/init/${selectedRoute.id}`;
      try {
        const data = {
          routeId: selectedRoute.id, 
        };

        const response = await postGameStatus(url, data);
        await saveToStorage('gameId', response);
        setGameStatus(true);
        await saveToStorage('gameStatus', true);
      } catch (error) {
        console.error('Error during game initialization:', error);
      }
    }
  };

  const endGame = async () => {
    const gameId = await getFromStorage('gameId');
    const url = `${BASE_URL}/api/game/${gameId}/end`;
    try {
    //   await postGameStatus(url);
      setGameStatus(false);
      setTimeToEnd(null);
      setSelectedRoute(null);

      await removeFromStorage('gameId');
      await removeFromStorage('timeToEnd');
      await removeFromStorage('routeId');
      await saveToStorage('gameStatus', false);
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const handleSelectedRoute = async (route) => {
    setSelectedRoute(route);
    if (route) {
      await saveToStorage('routeId', route.id);
    } else {
      await removeFromStorage('routeId');
    }
  };

  const handleTimeToEnd = async (time) => {
    const totalTime = time * 60; // Convert minutes to seconds
    setTimeToEnd(totalTime);
    await saveToStorage('timeToEnd', totalTime);
  };

  useEffect(() => {
    let timerId;

    if (gameStatus && timeToEnd > 0) {
      timerId = setInterval(() => {
        setTimeToEnd((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerId);
            endGame();
            return 0;
          }
          const newTime = prevTime - 1;
          saveToStorage('timeToEnd', newTime);
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [gameStatus, timeToEnd]);

  useEffect(() => {
    const restoreState = async () => {
      const savedTime = await getFromStorage('timeToEnd');
      const savedStatus = await getFromStorage('gameStatus');
      const savedRouteId = await getFromStorage('routeId');

      if (savedTime !== null && savedStatus === true && savedRouteId !== null) {
        setTimeToEnd(savedTime);
        setGameStatus(true);
        setSelectedRoute({ id: savedRouteId });
      } else {
        await removeFromStorage('timeToEnd');
        await removeFromStorage('gameStatus');
        await removeFromStorage('routeId');
      }
    };
    restoreState();
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameStatus,
        handleGameStatus,
        timeToEnd,
        handleTimeToEnd,
        selectedRoute,
        handleSelectedRoute,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameStatus = () => useContext(GameContext);

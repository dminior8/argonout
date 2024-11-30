import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BottomMenu from './BottomMenu'; 
import BasicMap from './BasicMap'; 
import MiniStats from './MiniStats'; 
import GameConfigDrawer from './GameConfigDrawer';
import { useUser } from '../context/UserContext';
import { useGameStatus } from '../context/GameContext'; 
import { BASE_URL } from '../config';

const AdventureModePage = () => {
  const { user, updateUserPoints } = useUser();
  const [routes, setRoutes] = useState([]);
  const [places, setPlaces] = useState([]);
  const [currentPlace, setCurrentPlace] = useState(null); 
  const [timeToEnd, setTimeToEnd] = useState(0);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { 
    gameStatus, handleGameStatus, 
    selectedRoute, handleSelectedRoute 
  } = useGameStatus();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('accessTokenFront');
        const response = await axios.get(`${BASE_URL}/api/routes/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoutes(response.data);

        const savedRouteId = await AsyncStorage.getItem("routeId");
        if (savedRouteId) {
          const savedRoute = response.data.find((route) => route.id === savedRouteId);
          if (savedRoute) {
            handleSelectedRoute(savedRoute);
          }
        }
      } catch (error) {
        console.error('Error during routes fetching: ', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('accessTokenFront');
        
        if (!selectedRoute) {
          const response = await axios.get(`${BASE_URL}/api/places`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPlaces(response.data);
        } else {
          const response = await axios.get(`${BASE_URL}/api/places/${selectedRoute.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setPlaces(response.data);
        }
      } catch (error) {
        console.error('Error during places fetching: ', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlaces();
  }, [selectedRoute]);

  const handleRouteChange = (selectedRouteId) => {
    if (gameStatus) {
      handleGameStatus();
    }
    const route = routes.find((r) => r.id === selectedRouteId);
    setTimeToEnd(route?.maxTime);

    if (selectedRouteId === "default") {
      handleSelectedRoute(null);
      return;
    }

    handleSelectedRoute(route);
  };

  const updatePointsInGame = async () => {
    const newPoints = user.points + 15;
    await updateUserPoints(newPoints);
  };

  const postVisitedPlace = async (place) => {
    const token = await AsyncStorage.getItem('accessTokenFront');
    const gameId = await AsyncStorage.getItem("gameId");
  
    const cleanedToken = token?.replace(/^"|"$/g, "");
    const cleanedGameId = gameId?.replace(/^"|"$/g, "");
  
    try {
      const response = await axios.post(`${BASE_URL}/api/game/${cleanedGameId}/add-place/${place.id}`, {}, {
        headers: { Authorization: `Bearer ${cleanedToken}` }
      });
      return response.data;
    } catch (error) {
      console.error("Błąd podczas wykonywania zapytania:", error.message);
      throw error;
    }
  };
  

  const handleVisitedPlace = (place) => {
    try {
      updatePointsInGame();
      postVisitedPlace(place);
      Alert.alert("Odwiedziłeś", `${place.name}`);
    } catch (e) {
      console.error("Error during adding visited place: ", e);
    }

    setPlaces((prevPlaces) =>
      prevPlaces.map((p) => (p.id === place.id ? { ...p, visited: true } : p))
    );
  };

  const handlePopupClick = (markerData) => {
    setCurrentPlace(markerData.placeId);
  };

  return (
    <View style={styles.appContent}>
      <MiniStats />
      
      {/* Display loading indicator while places are being fetched */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00f" />
        </View>
      ) : (
        <View style={styles.mapContainer}>

          <BasicMap
            onPopupClick={handlePopupClick}
            places={places}
            onPlaceVisit={handleVisitedPlace}
            currentPlace={currentPlace}
            gameStatus={gameStatus}
          />
        </View>
      )}

      <TouchableOpacity style={styles.toggleButton} onPress={() => setDrawerOpen(!isDrawerOpen)}>
        <Text style={styles.toggleButtonText}>{isDrawerOpen ? 'Zamknij' : (gameStatus ? 'Aktualna gra' : 'Rozpocznij grę')}</Text>
      </TouchableOpacity>

      <GameConfigDrawer
        isOpen={isDrawerOpen}
        routes={routes}
        selectedRoute={selectedRoute}
        handleRouteChange={handleRouteChange}
        gameStatus={gameStatus}
        handleGameStatus={handleGameStatus}
        timeToEnd={timeToEnd}
      />
      
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  appContent: {
    flex: 1,
    flexDirection: 'row',
  },
  mapContainer: {
    flex: 1
  },
  toggleButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    padding: 20,
    backgroundColor: '#131F24',
    borderRadius: 8
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    zIndex: 1000,
  },
});

export default AdventureModePage;

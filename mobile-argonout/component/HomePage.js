import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

import { BASE_URL } from '../config';

import BasicMap from './BasicMap';
import MiniStats from './MiniStats';
import BottomMenu from './BottomMenu';

const HomePage = () => {
  const [places, setPlaces] = useState([]);
  const [addPlaceMode, setAddPlaceMode] = useState(false);
  const [newPlacePosition, setNewPlacePosition] = useState(null);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetAll = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('accessTokenFront');
      await axios
      .get(`${BASE_URL}/api/places`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPlaces(res.data);
      });
      
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const gameId = AsyncStorage.getItem('gameId');
    if (!gameId) {
      AsyncStorage.removeItem('gameId');
    }
    handleGetAll();
  }, []);

  const postVisitedPlace = async (place) => {
    try {
      const token = await AsyncStorage.getItem('accessTokenFront');
  
      const response = await axios.post(
        `${BASE_URL}/api/free-game/add-place/${place.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      return response.data;
    } catch (error) {
      if (error.response) {
        // Jeśli serwer zwrócił odpowiedź z błędem (np. status 400)
        throw new Error(error.response.data.message || "Wystąpił błąd podczas dodawania miejsca.");
      } else if (error.request) { // Jeśli żądanie nie zostało wysłane
        throw new Error("Nie udało się nawiązać połączenia z serwerem.");
      } else { // Inny błąd
        throw new Error("Wystąpił nieoczekiwany błąd: " + error.message);
      }
    }
  };
  
  

  const handleVisitedPlace = async (place) => {
    try {
      const data = await postVisitedPlace(place); // Jeśli funkcja zadziała poprawnie
      Alert.alert("Sukces", `Odwiedziłeś ${place.name}`);
      
      setPlaces((prevPlaces) =>
        prevPlaces.map((p) => (p.id === place.id ? { ...p, visited: true } : p))
      );
    } catch (error) {
      Alert.alert("Błąd", error.message);
      console.error("Error during adding visited place:", error);
    }
  };
  

  // Obsługa kliknięcia popupu
  const handlePopupClick = (markerData) => {
    setCurrentPlace(markerData.placeId);
  };

  useEffect(() => {
    if (isLoading) {
      <Spinner visible={isLoading} textContent={'Ładowanie...'} textStyle={styles.spinnerTextStyle} />
      
    }
  }, [isLoading]);

  return (
    <View style={styles.appContent}>
      <MiniStats />
      <View style={styles.mapContainer}>
        {isLoading ? 
        <Spinner visible={isLoading} textContent={'Ładowanie...'} textStyle={styles.spinnerTextStyle} />
        :
        <BasicMap
          onPopupClick={handlePopupClick}
          places={places}
          onPlaceVisit={handleVisitedPlace}
          currentPlace={currentPlace}

        />
        }
        
      </View>
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  appContent: {
    flex: 1,
    backgroundColor: '#131F24',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height:"50%",
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
});


export default HomePage;

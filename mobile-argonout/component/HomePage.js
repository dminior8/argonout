import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

import { BASE_URL } from '../config';

import Sidebar from './Sidebar';
import BasicMap from './BasicMap';

const HomePage = () => {
  const [places, setPlaces] = useState([]); // Lista miejsc
  const [addPlaceMode, setAddPlaceMode] = useState(false); // Tryb dodawania miejsc
  const [newPlacePosition, setNewPlacePosition] = useState(null); // Pozycja nowego miejsca
  const [currentPlace, setCurrentPlace] = useState(null); // Obecne miejsce (do otwierania popupu)
  const [isLoading, setIsLoading] = useState(true); // Stan ładowania

  // Pobieranie wszystkich miejsc z API
  const handleGetAll = async () => {
    try {
      setIsLoading(true); // Ustaw ładowanie na true przed rozpoczęciem pobierania
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
      setIsLoading(false); // Wyłącz ładowanie po zakończeniu
    }
  };

  useEffect(() => {
    const gameId = AsyncStorage.getItem('gameId');
    if (!gameId) {
      AsyncStorage.removeItem('gameId');
    }
    handleGetAll();
  }, []); // Zmiana na pustą tablicę zależności []

  // Obsługa dodania odwiedzonego miejsca
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
      if (error.response && error.response.status === 401) {
        Alert.alert('Sesja wygasła', 'Zostałeś wylogowany.');
        await AsyncStorage.removeItem('accessTokenFront');
        if (navigation) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      }
      console.error('Error during adding visited place: ', error);
    }
  };

  const handleVisitedPlace = (place) => {
    postVisitedPlace(place).then((responseMessage) => {
      console.log('Message from server:', responseMessage);
    });

    Alert.alert(`Odwiedziłeś ${place.name}.`);
  };

  // Obsługa kliknięcia popupu
  const handlePopupClick = (markerData) => {
    setCurrentPlace(markerData.placeId); // Zapisuje ID miejsca, które zostało kliknięte
  };

  useEffect(() => {
    if (isLoading) {
      <Spinner visible={isLoading} textContent={'Ładowanie...'} textStyle={styles.spinnerTextStyle} />
      
    }
  }, [isLoading]);

  return (
    <View style={styles.appContent}>
      {/* Sidebar nawigacyjny */}
      <Sidebar />
      <View style={styles.mapContainer}>
        {isLoading ? 
        <Spinner visible={isLoading} textContent={'Ładowanie...'} textStyle={styles.spinnerTextStyle} />
        :
        <BasicMap
          newPlacePosition={newPlacePosition}
          onPopupClick={handlePopupClick}
          places={places} // Przekazujemy załadowane dane do BasicMap
          onPlaceVisit={handleVisitedPlace}
          currentPlace={currentPlace}
        />
        }
        
      </View>
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
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
});


export default HomePage;

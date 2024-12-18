import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

import { BASE_URL } from '../config';

import QRScanner from '../component/QRScanner';
import BasicMap from '../component/BasicMap';
import MiniStats from '../component/MiniStats';
import BottomMenu from '../component/BottomMenu';

const HomePage = () => {
  const [places, setPlaces] = useState([]);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [scannedPlace, setScannedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);

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

  const postVisitedPlace = async (qrCode) => {
    try {
      const token = await AsyncStorage.getItem('accessTokenFront');
  
      const response = await axios.post(
        `${BASE_URL}/api/free-game/add-place/${scannedPlace.id}`,
        {"qrCodeData": qrCode},
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

  const handleQRCodeScanned = async (qrData) => {
    
    setShowQRScanner(false);
    try {
      const data = await postVisitedPlace(qrData); // Jeśli funkcja zadziała poprawnie
      Alert.alert("Sukces", `Odwiedziłeś ${scannedPlace.name}`);
      
      setPlaces((prevPlaces) =>
        prevPlaces.map((p) => (p.id === scannedPlace.id ? { ...p, visited: true } : p))
      );
    } catch (error) {
      Alert.alert("Błąd", error.message);
      console.error("Error during adding visited place:", error);
    }
  };

  const handlePlaceVisit = (place) => {
    setScannedPlace(place);
    setShowQRScanner(true);
  };
  
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
          onPlaceVisit={handlePlaceVisit}
          currentPlace={currentPlace}
          onQRCodeScanned={handlePlaceVisit}

        />
        }
        
      </View>
      <BottomMenu />
      {showQRScanner && <QRScanner onQRCodeScanned={handleQRCodeScanned} />}
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

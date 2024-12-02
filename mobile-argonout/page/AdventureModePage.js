import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BottomMenu from '../component/BottomMenu'; 
import BasicMap from '../component/BasicMap'; 
import MiniStats from '../component/MiniStats'; 
import GameConfigDrawer from '../component/GameConfigDrawer';
import QRScanner from '../component/QRScanner';
import { useUser } from '../context/UserContext';
import { useGameStatus } from '../context/GameContext'; 
import { BASE_URL } from '../config';

const AdventureModePage = () => {
  const { user, updateUserPoints } = useUser();
  const [routes, setRoutes] = useState([]);
  const [places, setPlaces] = useState([]);
  const [currentPlace, setCurrentPlace] = useState(null); 
  const [scannedPlace, setScannedPlace] = useState(null);
  const [timeToEnd, setTimeToEnd] = useState(0);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRScanner, setShowQRScanner] = useState(false);

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

  const postVisitedPlace = async (place, qrCode) => {
    const gameId = await AsyncStorage.getItem("gameId");
  
    try {
      const token = await AsyncStorage.getItem('accessTokenFront');
      const cleanedGameId = gameId?.replace(/^"|"$/g, "");
      console.log("WYSYŁANE: ", gameId, " ", cleanedGameId, " ", qrCode);
  
      const response = await axios.post(
        `${BASE_URL}/api/game/${cleanedGameId}/add-place/${place.id}`,
        { "qrCodeData": qrCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data) {
        Alert.alert("Sukces", "Miejsce zostało pomyślnie dodane do gry.");
      }
  
      return response.data;
    } catch (error) {
      console.error("Błąd podczas wykonywania zapytania:", error.message);
  
      // Obsługa różnych błędów na podstawie statusu HTTP
      if (error.response) {
        // Jeśli serwer odpowiedział, ale z błędem (np. 400, 404, 500)
        const errorMessage = error.response.data.message || "Wystąpił błąd. Spróbuj ponownie.";
  
        // Pokazanie komunikatu błędu w postaci alertu
        Alert.alert("Błąd", errorMessage);
      } else if (error.request) {
        // Jeśli nie ma odpowiedzi od serwera (np. problem z połączeniem)
        Alert.alert("Błąd", "Brak odpowiedzi od serwera. Sprawdź połączenie internetowe.");
      } else {
        // Inne nieoczekiwane błędy
        Alert.alert("Błąd", "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
      }
  
      // Rzucenie błędu, aby umożliwić dalsze przetwarzanie
      throw error;
    }
  };
  
  const handleQRCodeScanned = async (qrData) => {
    
    setShowQRScanner(false);
      try {
        await postVisitedPlace(scannedPlace, qrData); // Send QR code and place ID
        updatePointsInGame();
        Alert.alert("Odwiedziłeś", `${scannedPlace.name}`);
        setPlaces((prevPlaces) =>
          prevPlaces.map((p) => (p.id === scannedPlace.id ? { ...p, visited: true } : p))
        );
      } catch (error) {
        console.error("Error during QR scan handling:", error);
      }
  };

  const handlePlaceVisit = (place) => {
    setScannedPlace(place); // Ustawienie ID miejsca, które odwiedzimy
    setShowQRScanner(true); // Pokazanie QRScannera, gdy użytkownik kliknie przycisk "Odwiedź"
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
            onPlaceVisit={handlePlaceVisit}
            currentPlace={currentPlace}
            gameStatus={gameStatus}
            onQRCodeScanned={handlePlaceVisit}
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

      {showQRScanner && <QRScanner onQRCodeScanned={handleQRCodeScanned} />}
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

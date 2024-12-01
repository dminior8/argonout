import React, { useRef, useEffect, useState } from 'react';
import { Animated, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import Timer from './Timer';

const GameConfigDrawer = ({
  isOpen,
  routes,
  selectedRoute,
  handleRouteChange,
  gameStatus,
  handleGameStatus,
  timeToEnd,
}) => {
  const slideAnim = useRef(new Animated.Value(isOpen ? 0 : 300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : 330, // 0 - otwarte, 300 - schowane
      duration: 330,
      useNativeDriver: true, // Używamy native drivera dla lepszej wydajności
    }).start();
  }, [isOpen]);

  return (
    <Animated.View style={[styles.drawer, { transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.title}>Konfiguracja Gry</Text>

      {/* Opis wybranej trasy */}
      {selectedRoute && (
        <View style={styles.routeDetails}>
          <Text style={styles.routeName}>{selectedRoute.name}</Text>
          <Text style={styles.routeDescription}>{selectedRoute.description}</Text>
          <Text style={styles.routeMaxTime}>
            Czas na wykonanie: <Text style={{ fontWeight: 'bold' }}>{selectedRoute.maxTime} minut</Text>
          </Text>
        </View>
      )}

      {/* Wyświetlanie timera w trakcie gry */}
      {gameStatus && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            Pozostały czas: <Timer timeToEnd={timeToEnd} />
          </Text>
        </View>
      )}

      {/* Przycisk rozpoczęcia/zakończenia gry */}
      {selectedRoute && (
        <TouchableOpacity style={styles.startButton} onPress={handleGameStatus}>
          <Text style={styles.startButtonText}>
            {gameStatus ? 'Zakończ Grę' : 'Rozpocznij Grę'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Selector trasy */}
      {gameStatus ? null : (
      <Picker
        selectedValue={selectedRoute ? selectedRoute.id : 'default'}
        onValueChange={handleRouteChange}
        style={styles.picker}
        itemStyle={styles.pickerItem}>
        <Picker.Item label="Wybierz trasę" value="default" />
        {routes.map((route) => (
          <Picker.Item key={route.id} label={route.name} value={route.id} />
        ))}
      </Picker>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 330,
    backgroundColor: '#131F24',
    color: '#FFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 10,
  },
  title: {
    color: '#72FFE6',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerItem: {
    color: '#FFF', // Kolor tekstu dla elementów
    fontSize: 16,  // Dostosowanie wielkości
  },  
  startButton: {
    backgroundColor: '#2F7A7E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  routeDetails: {
    marginBottom: 20,
  },
  routeName: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  routeDescription: {
    color: '#CCC',
    fontSize: 14,
    marginVertical: 5,
  },
  routeMaxTime: {
    color: '#FFF',
    fontSize: 14,
  },
  timerContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  timerText: {
    color: '#C1C1C1',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default GameConfigDrawer;

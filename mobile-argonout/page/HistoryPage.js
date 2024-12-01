import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { BASE_URL } from '../config';
import MiniStats from './../component/MiniStats';
import BasicMap from './../component/BasicMap';
import BottomMenu from '../component/BottomMenu';

const HistoryPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessTokenFront');
      const response = await axios.get(`${BASE_URL}/api/places/visited`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPlaces(response.data.content || []);
    } catch (error) {
      console.error('Error during places fetching: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handlePlaceClick = (place) => {
    Alert.alert(
      place.name,
      `🏷️ Opis: ${place.description || 'Brak opisu'}\n\n🛤️ Trasa: ${
        place.routeName || 'Nieznana trasa'
      }\n\n🕒 Data odwiedzenia: ${place.visitedAt || 'Nieznana'}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const renderPlace = ({ item }) => (
    <TouchableOpacity
      style={styles.singleRecord}
      onPress={() => handlePlaceClick(item)}
    >
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.historyName}>{item.name}</Text>
        <Text style={styles.otherHistoryInfo}>
          {(!item.routeName || item.routeName === 'Unknown Route'
            ? 'Inna • '
            : item.routeName + ' • ') + item.visitedAt}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* MiniStats */}
      <MiniStats style={styles.miniStats} />

      {/* Lista odwiedzonych miejsc */}
      <View style={styles.mainContent}>
        <Text style={styles.historyLabel}>Odwiedzone miejsca</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#D1D1D1" />
        ) : (
          <FlatList
            data={places}
            renderItem={renderPlace}
            keyExtractor={(item, index) => `${item.placeId}-${index}`}
            contentContainerStyle={styles.historyList}
          />
        )}
      </View>
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#131F24',
  },
  miniStats: {
    padding: 10,
  },
  mainContent: {
    flex: 2,
    padding: 20,
    backgroundColor: '#131F24',
  },
  historyLabel: {
    color: '#c1c1c1',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
    marginTop: 25,
  },
  historyList: {
    flexGrow: 1,
  },
  singleRecord: {
    padding: 10,
    borderRadius: 12,
    borderColor: 'transparent',
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  historyName: {
    color: '#D1D1D1',
    fontWeight: 'bold',
    fontSize: 16,
  },
  otherHistoryInfo: {
    color: '#D1D1D1',
    opacity: 0.7,
    fontSize: 12,
  },
  description: {
    color: '#D1D1D1',
    opacity: 0.9,
    fontSize: 14,
  },
});

export default HistoryPage;

import React, { useEffect, useState } from 'react';
import MapView, { Marker, Circle } from 'react-native-maps';
import { StyleSheet, Text, View, Pressable, Alert, Image } from 'react-native';

const BasicMap = ({
  onPopupClick,
  places,
  onPlaceVisit,
  currentPlace,
  gameStatus,
  onQRCodeScanned
}) => {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState({
    latitude: 50.061796, 
    longitude: 19.938244,
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const radius = 100;
  const center = { latitude: 50.061796, longitude: 19.938244 };

  const MarkerIcon = require('../assets/icons/mapMarkersImages/marker.png');
  const VisitedMarkerIcon = require('../assets/icons/mapMarkersImages/visited-marker.png');

  useEffect(() => {
  }, [userLocation, places, nearbyPlaces]);

  useEffect(() => {
    if (currentPlace) {
      Alert.alert('Informacja', `Wybrano miejsce: ${currentPlace}`);
    }
  }, [currentPlace]);

  const handleUserLocation = (location) => {
    setUserLocation(location);
    const nearby = places.filter((place) => {
      const distance = calculateDistance(
        location.latitude, 
        location.longitude,
        place.latitude,
        place.longitude
      );
      return distance <= radius;
    });
    setNearbyPlaces(nearby);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Convert to meters
  };

  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
    onPopupClick(place);
  };

  const handlePlaceVisit = (place) => {
    onPlaceVisit(place); // Wywołanie callbacku do `AdventureModePage`
     // Przekazywanie ID miejsca do funkcji skanowania QR
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        onUserLocationChange={(e) => handleUserLocation({ latitude: 50.061796, longitude: 19.938244 })}
      >
        {places.map((place, index) => (
          place.latitude && place.longitude && (
            <Marker
              key={`${place.id}-${index}`}
              coordinate={{ latitude: place.latitude, longitude: place.longitude }}
              onPress={() => handleMarkerPress(place)}
            >
              <Image
                source={place.visited === true ? VisitedMarkerIcon : MarkerIcon}
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
              />
            </Marker>
          )
        ))}

        {userLocation && (
          <Circle
            center={userLocation}
            radius={radius}
            fillColor="rgba(0, 0, 255, 0.3)"
            strokeColor="rgba(0, 0, 255, 0.5)"
          />
        )}
      </MapView>

      {selectedPlace && (
        <View style={styles.popupContainer}>
          <Text style={styles.popupTitle}>{selectedPlace.name}</Text>
          <Text style={styles.popupDescription}>{selectedPlace.description}</Text>
          
          {gameStatus || gameStatus == undefined ? (
            <View>
              <Pressable
                style={[
                  styles.visitButton,
                  { opacity: nearbyPlaces.some((p) => p.id === selectedPlace.id) ? 1 : 0.3 }
                ]}
                onPress={() => handlePlaceVisit(selectedPlace)}
                disabled={!nearbyPlaces.some((p) => p.id === selectedPlace.id)}
              >
                <Text style={styles.visitButtonText}>{`Odwiedź ${selectedPlace.name}`}</Text>
              </Pressable>

              {selectedPlace.visited && (
                <Text style={styles.visitedText}>Miejsce odwiedzone</Text>
              )}
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  popupContainer: {
    position: 'absolute', // Umieszczamy popup nad mapą
    top: 100,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    zIndex: 999,
  },
  popupTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  popupDescription: {
    textAlign: 'justify',
    marginBottom: 15,
    lineHeight: 18,
  },
  visitButton: {
    backgroundColor: '#008CBA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    textAlign: 'center',
    alignSelf: 'center',
  },
  visitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  visitedText: {
    color: "#56bfc1",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 17,
  }
});

export default BasicMap;

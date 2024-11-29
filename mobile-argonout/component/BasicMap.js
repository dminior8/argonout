import React, { useEffect, useState } from 'react';
import MapView, { Marker, Circle, Callout } from 'react-native-maps';
import { StyleSheet, Text, View, Pressable, Alert, Image } from 'react-native';

const BasicMap = ({
  onPopupClick,
  places,
  onPlaceVisit,
  currentPlace,
}) => {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const radius = 100;
  const center = { latitude: 50.05931, longitude: 19.94251 };
  const MarkerIcon = require('../assets/icons/mapMarkersImages/marker.png');
  const VisitedMarkerIcon = require('../assets/icons/mapMarkersImages/visited-marker.png');

  useEffect(() => {
    if (currentPlace) {
      Alert.alert('Informacja', `Wybrano miejsce: ${currentPlace}`);
    }
  }, [currentPlace]);

  const handleUserLocation = (location) => {
    setUserLocation(location);
    const nearby = places.filter((place) => {
      const distance = calculateDistance(
        50.061796, 19.938244,
        // location.latitude, location.longitude,
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
        onUserLocationChange={(e) => handleUserLocation(e.nativeEvent.coordinate)}
      >
        {places.map((place, index) => (
          place.latitude && place.longitude && (
            <Marker
              key={`${place.id}-${index}`}
              coordinate={{ latitude: place.latitude, longitude: place.longitude }}
              onPress={() => onPopupClick(place)}
            >
              <Image
                source={place.visited === true ? VisitedMarkerIcon : MarkerIcon}
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
              />
              <Callout>
                <View style={styles.popupContainer}>
                  <Text style={styles.popupTitle}>{place.name}</Text>
                  <Text style={styles.popupDescription}>{place.description}</Text>
                  {nearbyPlaces.some((p) => p.id === place.id) ? (
                    place.visited ? (
                      <Text style={styles.visitedText}>Miejsce odwiedzone</Text>
                    ) : (
                      <Pressable
                        style={styles.visitButton}
                        onPress={() => onPlaceVisit(place)}
                      >
                        <Text style={styles.visitButtonText}>{`Odwiedź ${place.name}`}</Text>
                      </Pressable>
                    )
                  ) : null}
                </View>
              </Callout>
            </Marker>
          )
        ))}

        {userLocation && (
          <Circle
            // center={userLocation}
            center={{latitude: 50.061796, longitude: 19.938244}}
            radius={radius}
            fillColor="rgba(0, 0, 255, 0.3)"
            strokeColor="rgba(0, 0, 255, 0.5)"
          />
        )}
      </MapView>
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
      padding: 10,
      minWidth: 220,
      maxWidth: 280,
      backgroundColor: 'white',
    },
    popupTitle: {
      fontWeight: 'bold',
      fontSize: 16, 
      marginBottom: 10,
      textAlign: 'center',
      flexWrap: 'wrap', // Pozwala na łamanie wierszy
    },
    popupDescription: {
      textAlign: 'justify',
      marginBottom: 15, 
      lineHeight: 18, //Lepsza czytelność tekstu
    },
    visitButton: {
      backgroundColor: '#008CBA',
      paddingVertical: 12, // Większy pionowy padding, aby przycisk był wyraźny
      paddingHorizontal: 20,
      borderRadius: 5,
      textAlign: 'center',
      alignSelf: 'center', // Centruje przycisk w pop-upie
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
      fontSize: 17
    }
  });
export default BasicMap;  
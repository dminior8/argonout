import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"
import { BASE_URL } from '../config';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessTokenFront');
        if (token) {
          const decodedUser = jwtDecode(token);
          setUser(decodedUser); // Dekodowanie tokenu i zapisanie danych użytkownika w stanie
          console.log("DECODED: ", decodedUser);
        }
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    };

    getUserFromToken(); // Dekodowanie tokenu przy załadowaniu komponentu
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('accessTokenFront');
      await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await AsyncStorage.removeItem('accessTokenFront');
      navigation.replace('Login'); // Przejście do ekranu logowania po wylogowaniu
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <View style={styles.hamburgerContainer}>
        <TouchableOpacity style={styles.hamburgerButton} onPress={toggleSidebar}>
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Sidebar Modal */}
      <Modal visible={isOpen} animationType="slide" transparent={true}>
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
            <Text style={styles.closeButtonText}>✖</Text>
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
          </View>

          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.menuText}>Graj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Adventure')}>
              <Text style={styles.menuText}>Tryb wyzwania</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Leaderboard')}>
              <Text style={styles.menuText}>Ranking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('History')}>
              <Text style={styles.menuText}>Historia</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Messages')}>
              <Text style={styles.menuText}>Wiadomości</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
              <Text style={styles.menuText}>Ustawienia</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={styles.menuText}>Wyloguj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  hamburgerContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1000,
  },
  hamburgerButton: {
    padding: 10,
    backgroundColor: '#131F24',
    borderRadius: 8,
  },
  hamburgerText: {
    color: '#D1D1D1',
    fontSize: 24,
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#131F24',
    paddingTop: 20,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10
  },
  closeButtonText: {
    color: '#D1D1D1',
    fontSize: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: "100%",
    height: 80,
    resizeMode: 'contain',
  },
  menuItem: {
    marginBottom: 20,
  },
  menuText: {
    color: '#D1D1D1',
    fontSize: 22,
    textAlign: "center",
    padding: 8
  },
});

export default Sidebar;

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import { BASE_URL } from '../config';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessTokenFront');
      const response = await axios.get(`${BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const updateUserPoints = async (newPoints) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser; 
      return { ...prevUser, points: newPoints };
    });
  };
  

  useEffect(() => {
    fetchUserProfile();
  }, []);


  const logout = async () => {
    await AsyncStorage.removeItem('accessTokenFront');
    setUser(null);
    navigation.navigate("Login");
  };


  const scheduleLogout = async (logoutCallback) => {
    try {
      const token = await AsyncStorage.getItem('accessTokenFront');
      if (!token) {
        console.error("No token found.");
        navigation.navigate("Login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; // Konwersja na milisekundy
      const currentTime = Date.now();

      if (expirationTime > currentTime) {
        const delay = expirationTime - currentTime;
        console.log(`Token expires in ${delay / 1000} seconds.`);

        // Ustaw timer, aby automatycznie wylogować po wygaśnięciu tokena
        setTimeout(async () => {
          await AsyncStorage.removeItem('accessTokenFront');
          logoutCallback();
        }, delay);
      } else {
        console.warn("Token already expired. Logging out immediately.");
        await AsyncStorage.removeItem('accessTokenFront');
        logoutCallback();
      }
    } catch (error) {
      console.error("Error scheduling logout:", error);
    }
  };


  useEffect(() => {
    scheduleLogout(logout);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserProfile, updateUserPoints }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook do korzystania z kontekstu
export const useUser = () => useContext(UserContext);

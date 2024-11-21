import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

// Tworzenie kontekstu
const UserContext = createContext();

// Provider dla kontekstu
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetchowanie profilu użytkownika
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('accessTokenFront');
        if (!token) {
          console.error("No token found.");
          return;
        }

        const response = await axios.get('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook do korzystania z kontekstu
export const useUser = () => useContext(UserContext);

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

import BottomMenu from '../component/BottomMenu';
import MiniStats from '../component/MiniStats';
import { BASE_URL } from '../config';

const SettingsPage = () => {
  const [userProfile, setUserProfile] = useState({
    id: '',
    username: '',
    email: '',
    firstName: '',
    surname: '',
    role: '',
    points: 0,
    createdAt: '',
  });

  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('accessTokenFront');

        const response = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserProfile(response.data);
        setEditedProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Błąd', 'Nie udało się pobrać danych użytkownika. Spróbuj ponownie później.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (name, value) => {
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('accessTokenFront');
      await axios.put(`${BASE_URL}/api/users/me`, editedProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Sukces', 'Profil zaktualizowany pomyślnie!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Błąd', 'Nie udało się zaktualizować profilu.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      Alert.alert(
        'Potwierdź',
        'Czy na pewno chcesz usunąć konto? Ta zmiana będzie nieodwracalna',
        [
          { text: 'Cofnij', style: 'cancel' },
          {
            text: 'Tak',
            onPress: async () => {
              const token = await AsyncStorage.getItem('accessTokenFront');
              await axios.delete(`${BASE_URL}/api/users/me`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              await AsyncStorage.removeItem('accessTokenFront');
              Alert.alert('Konto usunięte', 'Twoje konto zostało usunięte.');
              navigation.navigate("Login"); 
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account.');
    }
  };

  return (
    <View style={styles.container}>
      <MiniStats />
      <View style={styles.card}>
        <Text style={styles.title}>User Profile</Text>
        {isEditing ? (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={editedProfile.username}
              onChangeText={(value) => handleChange('username', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editedProfile.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={editedProfile.firstName}
              onChangeText={(value) => handleChange('firstName', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={editedProfile.surname}
              onChangeText={(value) => handleChange('surname', value)}
            />
            <View style={styles.buttonRow}>
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={handleEditToggle} color="red" />
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Username: </Text>
              {userProfile.username}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Email: </Text>
              {userProfile.email}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>First Name: </Text>
              {userProfile.firstName}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Last Name: </Text>
              {userProfile.surname}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Role: </Text>
              {userProfile.role}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Created At: </Text>
              {new Date(userProfile.createdAt).toLocaleString()}
            </Text>
            <View style={styles.buttonRow}>
              <Button title="Edit Profile" onPress={handleEditToggle} />
              <Button title="Delete Account" onPress={handleDeleteAccount} color="red" />
            </View>
          </View>
        )}
      </View>
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131F24',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#1E2E36',
    padding: 20,
    borderRadius: 12,
    marginTop:"30%",
    marginHorizontal: 15,
    borderColor: '#63b7bb',
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D1D1D1',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2F7A7E',
    color: '#def7f4',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  infoText: {
    color: '#def7f4',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#63b7bb',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default SettingsPage;

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { BASE_URL } from '../config';

const LoginPanel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [info, setInfo] = useState('');
  const navigation = useNavigation();

  const handleLogin = useCallback(
    (e) => {

      axios
        .post(`${BASE_URL}/api/auth/login`, { username, password }, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          if (response.data && response.data.token) {
            AsyncStorage.setItem('accessTokenFront', response.data.token); 
            console.log("TOKEN: ", response.data.token);
            
            // onLogin(true);
            setInfo("Zalogowano pomyślnie!");
            navigation.navigate('Home');
          } else {
            console.log("NIE MA TOKENA");
            console.error('Brak tokenu w odpowiedzi z serwera.');
            setInfo("Wystąpił błąd przy logowaniu.");
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              Alert.alert("Niepoprawny login lub hasło. Spróbuj ponownie.");
            } else {
              Alert.alert("Wystąpił nieznany błąd. Spróbuj ponownie później.");
            }
          }
          console.log(error);
        });
    },
    [username, password]
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.loginRight}>
        <Text style={styles.welcomeText}>Witaj w <Text style={styles.argonoutText}>Argonout!</Text></Text>
        <Text style={styles.h7}>Zaloguj się, aby kontynuować</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoFocus
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {info && <Text style={styles.errorMessage}>{info}</Text>}
          <Button
            title="Zaloguj"
            onPress={handleLogin}
            color="#2F7A7E"
          />
          <View style={styles.anotherOptionBtn}>
            <Text style={styles.anotherOptionText}>
              Nie masz jeszcze konta?&nbsp;
              <Text style={styles.loginRegisterLink}>Zarejestruj się!</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',  // Zamiast tła obrazu możesz użyć koloru
  },
  loginRight: {
    backgroundColor: 'rgba(19, 31, 36, 0.7)', 
    width: 350,
    padding: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  argonoutText: {
    fontSize: 24,
    color: '#56bfc1',
    fontWeight: 'bold',
  },
  h7: {
    fontSize: 16,
    color: '#b8d8d8',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    gap: 10,
    fontSize: 16,
  },
  textInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#56bfc1',
    borderRadius: 8,
    backgroundColor: '#0f1b1d',
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  errorMessage: {
    color: '#ff5c5c',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  anotherOptionBtn: {
    marginTop: 10,
    fontSize: 16,
    color: '#b8d8d8',
    textAlign: 'center',
  },
  loginRegisterLink: {
    color: '#56bfc1',
    fontWeight: 'bold',
  },
});

export default LoginPanel;
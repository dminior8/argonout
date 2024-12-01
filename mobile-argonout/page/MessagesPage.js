import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { BASE_URL } from '../config';
import BottomMenu from "./../component/BottomMenu";
import MiniStats from './../component/MiniStats'; // Zastanów się nad implementacją MiniStats w React Native

const MessagesPage = () => {
  const [formData, setFormData] = useState({
    topic: '',
    content: '',
  });

  const handleChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    try {
      const token = await AsyncStorage.getItem('accessTokenFront');
      const response = await axios.post(`${BASE_URL}/api/messages/send`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Sukces', `${response.data.message}`);
    } catch (error) {
      console.error('Error during sending message:', error);
      Alert.alert('Błąd', 'Wystąpił problem podczas wysyłania wiadomości.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.mainContent}>
        <Text style={styles.messageLabel}>Napisz do nas</Text>

        <View style={styles.messageForm}>
          <TextInput
            style={styles.textInputTitle}
            placeholder="Temat wiadomości"
            placeholderTextColor="#c1c1c1"
            value={formData.topic}
            onChangeText={((text) => handleChange('topic', text))}
            required
          />
          <TextInput
            style={styles.textInputDescription}
            placeholder="Opis problemu"
            placeholderTextColor="#c1c1c1"
            value={formData.content}
            onChangeText={((text) => handleChange('content', text))}
            multiline
            required
          />
          <TouchableOpacity style={styles.btnSend} onPress={handleSendMessage}>
            <Text style={styles.btnSendText}>Wyślij</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
      <MiniStats />
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    flex: 1,
    padding: 10,
  },
  mainContent: {
    flex: 2,
    padding: 20,
    backgroundColor: '#131F24',
  },
  messageLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 40,
    marginTop: 30
  },
  messageForm: {
    flexDirection: 'column',
    width: '100%',
  },
  textInputTitle: {
    width: '100%',
    padding: 10,
    borderRadius: 12,
    borderColor: '#2F7A7E',
    borderWidth: 1,
    color: '#D1D1D1',
    marginBottom: 10,
  },
  textInputDescription: {
    width: '100%',
    padding: 10,
    borderRadius: 12,
    borderColor: '#2F7A7E',
    borderWidth: 1,
    color: '#D1D1D1',
    marginBottom: 20,
    minHeight: 200,
  },
  btnSend: {
    backgroundColor: '#2F7A7E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    width: '100%',
  },
  btnSendText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  miniStats: {
    flex: 1,
    padding: 10,
  },
});

export default MessagesPage;

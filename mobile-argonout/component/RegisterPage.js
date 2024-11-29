import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import { BASE_URL } from '../config';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const navigation = useNavigation();

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Błąd', 'Hasła nie są takie same!');
            return;
        }

        const dataToSend = {
            username: formData.username,
            email: formData.email,
            firstName: formData.firstName,
            surname: formData.surname,
            password: formData.password,
        };

        try {
            const response = await axios.post(`${BASE_URL}/api/auth/register`, dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                Alert.alert('Sukces', 'Zarejestrowano pomyślnie!');
                navigation.navigate('Login'); // Przejście do ekranu logowania
            } else {
                Alert.alert('Błąd', `Wystąpił błąd podczas rejestracji: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Błąd', 'Wystąpił problem z rejestracją. Spróbuj ponownie.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.header}>Witaj w Argonout!</Text>
                <Text style={styles.subHeader}>Zarejestruj się, aby kontynuować</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Imię"
                    value={formData.firstName}
                    onChangeText={(text) => handleChange('firstName', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nazwisko"
                    value={formData.surname}
                    onChangeText={(text) => handleChange('surname', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nazwa użytkownika"
                    value={formData.username}
                    onChangeText={(text) => handleChange('username', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => handleChange('email', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Hasło"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Powtórz hasło"
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleChange('confirmPassword', text)}
                />
                
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Zarejestruj</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>Masz już konto? Zaloguj się!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f1b1d',
    },
    formContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'rgba(19, 31, 36, 0.7)',
        borderRadius: 16,
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 16,
        color: '#b8d8d8',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#0f1b1d',
        color: '#fff',
        borderColor: '#56bfc1',
        borderWidth: 1,
        marginBottom: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#2F7A7E',
        paddingVertical: 12,
        width: '100%',
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        color: '#56bfc1',
        fontSize: 16,
        textDecorationLine: 'underline',
        marginTop: 10,
    },
});
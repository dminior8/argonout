import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import RegisterPage from './component/RegisterPage';
import LoginPage from './component/LoginPage';
import HomePage from './component/HomePage';
import { UserProvider } from './context/UserContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
        <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
        >
          <Stack.Screen name="Register" component={RegisterPage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Home" component={HomePage} />
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131F24',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import RegisterPage from './page/RegisterPage';
import LoginPage from './page/LoginPage';
import HomePage from './page/HomePage';
import AdventureModePage from './page/AdventureModePage';
import LeaderboardPage from './page/LeaderboardPage';
import MessagesPage from './page/MessagesPage';
import SettingsPage from './page/SettingsPage';
import { GameProvider } from './context/GameContext'
import { UserProvider } from './context/UserContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <GameProvider>
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
            <Stack.Screen name="Adventure" component={AdventureModePage} />
            <Stack.Screen name="Leaderboard" component={LeaderboardPage} />
            <Stack.Screen name="Messages" component={MessagesPage} />
            <Stack.Screen name="Settings" component={SettingsPage} />
          </Stack.Navigator>
        </UserProvider>
      </GameProvider>
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

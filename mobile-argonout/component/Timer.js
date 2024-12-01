import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Timer = ({ timeToEnd }) => {
  const [timeLeft, setTimeLeft] = useState(timeToEnd * 0.5); // dla testów konwersja nie *60 (na sekundy), ale zmniejszenie

  useEffect(() => {
    //setTimeLeft(timeToEnd * 60); // Konwertuj minuty na sekundy - dla testów

    if (timeToEnd > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeToEnd]);

  const formattedHours = Math.floor(timeLeft / 3600);
  const formattedMinutes = Math.floor((timeLeft % 3600) / 60);
  const formattedSeconds = timeLeft % 60;

  const displayTime = `${formattedHours.toString().padStart(2, '0')}:${formattedMinutes
    .toString()
    .padStart(2, '0')}:${formattedSeconds.toString().padStart(2, '0')}`;

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{displayTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Timer;

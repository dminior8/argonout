// MiniStats.js

import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useUser } from "../context/UserContext";

const MiniStats = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.item, styles.pointsContainer]}>
        <Image source={require("../assets/icons/star_8605046.png")} style={styles.icon} />
        <Text style={styles.points}>{user.points}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 30,
    right: 15,
    flexDirection: "column",
    gap: 20,
    zIndex: "9999"
  },
  item: {
    backgroundColor: "#131F24",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Dla Androida
    borderColor: "#2F7A7E",
    borderWidth: 1,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    color: "#D1D1D1",
    marginRight: 10
  },
  points: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D1D1D1",
  }
});

export default MiniStats;

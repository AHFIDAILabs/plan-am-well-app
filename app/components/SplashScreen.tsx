import React from "react";
import { View, ActivityIndicator, Text, StyleSheet, Image } from "react-native";
import LottieView from "lottie-react-native";
export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/Logo.png")} 
        style={styles.logo}
        resizeMode="contain"
      />
    import LottieView from "lottie-react-native";

<LottieView
  source={require("../../assets/adaptive-icon.png")}
  autoPlay
  loop
  style={{ width: 150, height: 150 }}
/>

      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
});

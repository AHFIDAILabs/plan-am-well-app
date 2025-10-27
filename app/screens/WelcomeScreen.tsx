// SplashScreen.tsx
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace("Onboarding"), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/splash_1.jpg")} // 🧠 replace with your image
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <Text style={styles.title}>Welcome To PlanAmWell</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width, height, position: "absolute" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  title: {
    fontSize: 42,
    color: "#fff",
    fontWeight: "900",
    textTransform: "uppercase",
  },
});

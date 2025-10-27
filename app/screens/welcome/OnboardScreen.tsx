// OnboardingScreen.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    image: require("../../../assets/splash_1.jpg"),
    title: "Plan Am Well",
    description: "PLAN AM WELL is your trusted, confidential guide to sexual and reproductive health in Nigeria. No judgment, just facts.",
  },
  {
    id: 2,
    image: require("../../../assets/splash_2.jpg"),
    title: "Your Health. Your Questions. Answered.",
    description: " PLAN AM WELL uses cutting-edge AI to provide instant, accurate responses to your sexual and reproductive health queries.",
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();

  const handleGetStarted = () => navigation.replace("Register");

  return (
    <Swiper
      loop={false}
      dot={<View style={styles.dot} />}
      activeDot={<View style={styles.activeDot} />}
    >
      {slides.map((slide, index) => (
        <View key={slide.id} style={styles.slide}>
          <Image source={slide.image} style={styles.image} resizeMode="cover" />

          <View style={styles.card}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>

            {index === slides.length - 1 ? (
              <TouchableOpacity
                style={styles.button}
                onPress={handleGetStarted}
              >
                <Ionicons name="arrow-forward" size={22} color="#fff" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, alignItems: "center", backgroundColor: "#fff" },
  image: { width, height: height * 0.75 },
  card: {
  
    alignSelf: "center",
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 30,
        paddingHorizontal: 20,
    marginTop: -40,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#007AFF",
    borderRadius: 30,
    padding: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginBottom: 100,
  },
  activeDot: {
    width: 12,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#007AFF",
    marginBottom: 100,
  },
});

import React from "react";
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const mockClinics = [
  { id: "1", name: "Sunrise Medical Center", distance: "1.2km away", image: require("../../../assets/splash_1.jpg") },
  { id: "2", name: "Downtown Health Hub", distance: "2.5km away", image: require("../../../assets/splash_2.jpg") },
  { id: "3", name: "PrimeCare Hospital", distance: "3km away", image: require("../../../assets/splash.jpg") },
];

export default function FindClinicSection({ navigation }: any) {
  return (
    <View style={{ marginBottom: 24 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Clinics</Text>
        <TouchableOpacity onPress={() => navigation.navigate("FindClinic")}>
          <Text style={styles.link}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockClinics}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.distance}>{item.distance}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111" },
  link: { fontSize: 13, color: "#0077b6", fontWeight: "500" },
  card: {
    width: 140,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: "100%", height: 90 },
  name: { fontSize: 13, fontWeight: "600", margin: 8, color: "#111" },
  distance: { fontSize: 12, color: "#666", marginHorizontal: 8, marginBottom: 8 },
});

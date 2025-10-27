import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  image: any;
  rating: number;
  experience: string;
}

const doctorsData: DoctorItem[] = [
  {
    id: "d1",
    name: "Dr. Jane Foster",
    specialty: "Cardiologist",
    image: require("../../../assets/splash.jpg"),
    rating: 4.9,
    experience: "8 years",
  },
  {
    id: "d2",
    name: "Dr. Kelvin Brooks",
    specialty: "Dermatologist",
    image: require("../../../assets/splash_1.jpg"),
    rating: 4.7,
    experience: "5 years",
  },
  {
    id: "d3",
    name: "Dr. Aisha Bello",
    specialty: "Pediatrician",
    image: require("../../../assets/splash.jpg"),
    rating: 4.8,
    experience: "6 years",
  },
];

const BookADoctorSection = ({ onViewAll }: { onViewAll?: () => void }) => {
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>Book a Doctor</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={doctorsData}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.content}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.specialty}>{item.specialty}</Text>

              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.expText}>{item.experience}</Text>
              </View>

              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default BookADoctorSection;

const styles = StyleSheet.create({
  container: { marginBottom: 30 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111" },
  seeAll: { fontSize: 13, color: "#0077b6", fontWeight: "500" },

  card: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    overflow: "hidden",
  },
  image: { width: "100%", height: 110 },
  content: { padding: 10 },
  name: { fontWeight: "700", fontSize: 14, color: "#111" },
  specialty: { fontSize: 12, color: "#555", marginBottom: 6 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingText: { fontSize: 12, color: "#555", marginLeft: 4 },
  dot: { fontSize: 12, color: "#999", marginHorizontal: 4 },
  expText: { fontSize: 12, color: "#555" },
  btn: {
    backgroundColor: "#0077b6",
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});

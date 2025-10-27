import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AdvocacyItem {
  id: string;
  title: string;
  description: string;
  image: any;
  supporters: string;
}

const advocacyData: AdvocacyItem[] = [
  {
    id: "adv1",
    title: "Clean Water for All",
    description: "Support clean water initiatives in rural communities.",
    image: require("../../../assets/splash.jpg"),
    supporters: "1.2k supporters",
  },
  {
    id: "adv2",
    title: "Free Health Checkups",
    description: "Join campaigns offering free medical services to the poor.",
    image: require("../../../assets/splash_1.jpg"),
    supporters: "980 supporters",
  },
  {
    id: "adv3",
    title: "Mental Health Awareness",
    description: "Help raise awareness about mental wellness and therapy access.",
    image: require("../../../assets/splash.jpg"),
    supporters: "2.3k supporters",
  },
];

const AdvocacySection = ({ onViewAll }: { onViewAll?: () => void }) => {
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Advocacy Programs</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={advocacyData}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.supportRow}>
                <Ionicons name="people-outline" size={16} color="#2563eb" />
                <Text style={styles.supportText}>{item.supporters}</Text>
              </View>
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default AdvocacySection;

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
    width: 150,
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
  image: { width: "100%", height: 120 },
  cardContent: { padding: 10, flex: 1, justifyContent: "space-between" },
  cardTitle: { fontWeight: "700", fontSize: 14, color: "#111", marginBottom: 4 },
  cardDesc: { fontSize: 12, color: "#555", marginBottom: 6 },
  supportRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  supportText: { fontSize: 12, color: "#2563eb", marginLeft: 4 },
  btn: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});

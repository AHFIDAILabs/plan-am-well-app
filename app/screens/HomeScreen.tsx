import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import FindClinicSection from "../components/home/FindClinicSection";
import AdvocacySection from "../components/home/AdvocacySection";
import BookADoctorSection from "../components/home/BookDoctorSection";
import HealthRecordsSection from "../components/home/HealthRecordsSection";
import MessagesSection from "../components/home/MessagesSection";
import FloatingAskAmWell from "../components/home/FloatingAskAmWell";
import ProductSlider from "../components/home/OrderProductSection";
import { TopDoctorSection } from "../components/home/TopDoctorSection";

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const categories = [
    { key: "doctor", label: "Doctor", icon: "medkit-outline", color: "#06b6d4" },
    { key: "pharmacy", label: "Pharmacy", icon: "flask-outline", color: "#f59e0b" },
    { key: "hospital", label: "Hospital", icon: "business-outline", color: "#10b981" },
    { key: "ambulance", label: "Ambulance", icon: "car-outline", color: "#ef4444" },
  ];

  const topDoctors = [
    { 
      _id: "doc1",
      name: "Dr. Kunle Kakanfo",
      specialty: "Cardiologist",
      distance: "500m away",
      rating: 4.8,
      specialization: "Cardiologist",
      avatar: { url: "https://i.pravatar.cc/100?img=1" },
    },
    { 
      _id: "doc2",
      name: "Dr. Chichi",
      specialty: "Psychologist",
      distance: "1.5km away",
      rating: 4.5,
      specialization: "Psychologist",
      avatar: { url: "https://i.pravatar.cc/100?img=2" },
    },
    { 
      _id: "doc3",
      name: "Dr. Wale",
      specialty: "Orthopedist",
      distance: "2km away",
      rating: 4.2,
      specialization: "Orthopedist",
      avatar: { url: "https://i.pravatar.cc/100?img=3" },
    },
  ];

  const healthArticles = [
    { id: "a1", title: "How to maintain a healthy heart", category: "Health Tips" },
    { id: "a2", title: "5 Foods to boost your immunity", category: "Nutrition" },
  ];

  return (
    <AppLayout>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Find your desired</Text>
              <Text style={styles.headerSubtitle}>health solution</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#888" style={{ marginRight: 6 }} />
            <TextInput
              placeholder="Search doctor, articles..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Categories */}
          <View style={styles.categoryRow}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.categoryCard}
                onPress={() => navigation.navigate(item.key)}
              >
                <View
                  style={[styles.categoryIcon, { backgroundColor: `${item.color}20` }]}
                >
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text style={styles.categoryLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Banner */}
          <LinearGradient
            colors={["#4facfe", "#00f2fe"]}
            style={styles.bannerCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerText}>
                Early protection for your family health
              </Text>
              <TouchableOpacity style={styles.learnMoreBtn}>
                <Text style={styles.learnMoreText}>Learn more</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require("../../assets/splash_2.jpg")}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </LinearGradient>

          {/* Top Doctors (Dynamic Section) */}
          <TopDoctorSection
            doctors={topDoctors}
            onViewAll={() => navigation.navigate("FindDoctorScreen")}
            onDoctorPress={(id) => navigation.navigate("UserProfile", { userId: id })}
          />

          {/* Other sections */}
          <FindClinicSection />
          <AdvocacySection onViewAll={() => navigation.navigate("AdvocacyPrograms")} />
          <BookADoctorSection onViewAll={() => navigation.navigate("BookDoctor")} />
          <ProductSlider
            onViewAll={() => navigation.navigate("Pharmacy")}
            onOrder={(productId, quantity) => console.log("Order", productId, quantity)}
          />
          <HealthRecordsSection onViewAll={() => navigation.navigate("HealthRecords")} />
          <MessagesSection onViewAll={() => navigation.navigate("Messages")} />
          <FloatingAskAmWell />
        </ScrollView>
      </SafeAreaView>
    </AppLayout>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 16, paddingBottom: 100 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111" },
  headerSubtitle: { fontSize: 20, fontWeight: "700", color: "#111" },
  notifBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#f5f5f5", alignItems: "center", justifyContent: "center" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 20 },
  searchInput: { flex: 1, fontSize: 14, color: "#111" },
  categoryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  categoryCard: { alignItems: "center" },
  categoryIcon: { width: 54, height: 54, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  categoryLabel: { fontSize: 12, fontWeight: "600", color: "#111" },
  bannerCard: { flexDirection: "row", borderRadius: 18, padding: 18, alignItems: "center", marginBottom: 24 },
  bannerText: { color: "#fff", fontSize: 16, fontWeight: "700", flex: 1 },
  learnMoreBtn: { backgroundColor: "#fff", borderRadius: 10, paddingVertical: 6, paddingHorizontal: 14, marginTop: 10, alignSelf: "flex-start" },
  learnMoreText: { color: "#0077b6", fontWeight: "600" },
  bannerImage: { width: 140, height: 140 },
});

// app/screens/dashboards/UserDashboardScreen.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../components/layout/Header";
import AppDrawer from "../../components/layout/AppDrawer";
import BottomNavBar from "../../components/layout/BottomNavBar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
/**
 * Dashboard tiles with icons, short label, color and navigation target.
 * Add navigation targets (screens) in your AppStack / navigation.
 */
const TILE_DEFS = [
  { key: "book", title: "Book a Doctor", icon: "calendar-outline", color: "#f97316", screen: "BookDoctor" },
  { key: "records", title: "Health Records", icon: "folder-outline", color: "#3b82f6", screen: "HealthRecords" },
  { key: "messages", title: "Messages", icon: "chatbubbles-outline", color: "#eab308", screen: "ChatListScreen" },
  { key: "ask", title: "AskAmWell", icon: "mic-outline", color: "#8b5cf6", screen: "AskAmWell" }, // chatbot & voice
  { key: "order", title: "Order Product", icon: "cart-outline", color: "#10b981", screen: "Shop" },
  { key: "advocacy", title: "Advocacy", icon: "megaphone-outline", color: "#ef4444", screen: "Advocacy" },
  { key: "clinic", title: "Find a Clinic", icon: "locate-outline", color: "#06b6d4", screen: "FindClinic" },
  { key: "reminders", title: "Reminders", icon: "alarm-outline", color: "#f59e0b", screen: "Reminders" },
];

export default function UserDashboardScreen({ navigation }: any) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();

  const quickActions = useMemo(() => TILE_DEFS, []);

  const onTilePress = (screen?: string) => {
    if (!screen) return Alert.alert("Not implemented", "Screen not yet implemented");
    // TODO: replace with your navigation wiring. Example:
    // navigation.navigate(screen);
    // For now show a friendly placeholder:
    navigation.navigate(screen as any); // assume screen exists in your navigators
  };

  // placeholder summary — wiring: load these from API in real app
  const nextAppointment = { when: "12 Oct, 09:00 AM", doctor: "Dr. Esther" };
  const healthScore = 82;
  const activeGoals = "3 / 5";

  return (
    <SafeAreaView style={styles.safe}>
<AppHeader onMenuToggle={() => setDrawerOpen(s => !s)} drawerOpen={drawerOpen} />

      <KeyboardAwareScrollView contentContainerStyle={styles.container}>

        <LinearGradient colors={["#f6d365", "#fda085"]} style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
           <Text style={styles.greetingText}>
  {`Good ${new Date().getHours() < 12 ? "Morning" : "Evening"}, ${user?.firstName || "Friend"} 👋`}
</Text>

              <Text style={styles.subGreeting}>Here's your dashboard</Text>
            </View>

            <TouchableOpacity
              style={styles.smallAvatar}
              onPress={() => navigation.navigate("UserProfile", { userId: user?._id })}
            >

              <Ionicons name="person-circle" size={44} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Next</Text>
              <Text style={styles.summaryValue}>{nextAppointment.when}</Text>
              <Text style={styles.summaryNote}>{nextAppointment.doctor}</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Health</Text>
              <Text style={styles.summaryValue}>{healthScore}</Text>
              <Text style={styles.summaryNote}>Score</Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Goals</Text>
              <Text style={styles.summaryValue}>{activeGoals}</Text>
              <Text style={styles.summaryNote}>Progress</Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <FlatList
          data={quickActions}
          numColumns={2}
          scrollEnabled={false}
          keyExtractor={(i) => i.key}
          columnWrapperStyle={styles.column}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.actionCard, { backgroundColor: "#fff" }]}
              onPress={() => onTilePress(item.screen)}
            >
              <View style={[styles.iconWrapper, { backgroundColor: `${item.color}20` }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={styles.actionTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />

     
        <View style={styles.tipSection}>
          <LinearGradient colors={["#fda085", "#f6d365"]} style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={20} color="#fff" />
            <Text style={styles.tipText}>
              Today: Take a 10-minute walk after your meals — it helps digestion and mood.
            </Text>
          </LinearGradient>
        </View>
      </KeyboardAwareScrollView>

      <BottomNavBar active={"home" as any} />
      <AppDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7fafc" },
  container: { padding: 16, paddingBottom: 12 },

  headerCard: {
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    overflow: "hidden",
  },
  headerTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  greetingText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  subGreeting: { color: "#fff", opacity: 0.95, marginTop: 6 },
  smallAvatar: { marginLeft: 12 },

  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryLabel: { color: "#fff", fontSize: 13, opacity: 0.95 },
  summaryValue: { color: "#fff", fontSize: 18, fontWeight: "800", marginTop: 6 },
  summaryNote: { color: "#fff", fontSize: 12, opacity: 0.9, marginTop: 4 },

  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 12 },

  column: { justifyContent: "space-between", marginBottom: 12 },
  actionCard: {
    width: "48%",
    borderRadius: 14,
    padding: 14,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionTitle: { fontSize: 14, fontWeight: "700", color: "#111" },

  tipSection: { marginTop: 12 },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
  },
  tipText: { color: "#fff", marginLeft: 10, fontSize: 14, fontWeight: "600" },
});

import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RecordItem {
  id: string;
  type: string;
  date: string;
  doctor: string;
  status: string;
}

const healthRecordsData: RecordItem[] = [
  {
    id: "rec1",
    type: "General Checkup",
    date: "2025-09-12",
    doctor: "Dr. Lisa Grant",
    status: "Completed",
  },
  {
    id: "rec2",
    type: "Dental Cleaning",
    date: "2025-08-20",
    doctor: "Dr. James Cole",
    status: "Completed",
  },
  {
    id: "rec3",
    type: "Eye Test",
    date: "2025-07-15",
    doctor: "Dr. Aisha Bello",
    status: "Ongoing",
  },
];

const HealthRecordsSection = ({ onViewAll }: { onViewAll?: () => void }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Records</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Record List */}
      <FlatList
        data={healthRecordsData}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.recordType}>{item.type}</Text>
              <Text style={styles.recordDoctor}>{item.doctor}</Text>
              <Text style={styles.recordDate}>{item.date}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === "Completed" ? "#dcfce7" : "#fef9c3",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      item.status === "Completed" ? "#16a34a" : "#ca8a04",
                  },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HealthRecordsSection;

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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  recordType: { fontSize: 14, fontWeight: "700", color: "#111" },
  recordDoctor: { fontSize: 12, color: "#555" },
  recordDate: { fontSize: 12, color: "#999" },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
});

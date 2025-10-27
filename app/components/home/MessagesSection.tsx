import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MessageItem {
  id: string;
  name: string;
  message: string;
  time: string;
  unread?: boolean;
  avatar?: string;
}

const messagesData: MessageItem[] = [
  {
    id: "msg1",
    name: "Dr. Esther Miller",
    message: "Your test results are ready, let’s discuss.",
    time: "2m ago",
    unread: true,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "msg2",
    name: "Dr. Dexter Shaw",
    message: "Take the prescribed meds twice daily.",
    time: "1h ago",
    avatar: "https://randomuser.me/api/portraits/men/43.jpg",
  },
  {
    id: "msg3",
    name: "Support Team",
    message: "How was your consultation experience?",
    time: "Yesterday",
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  },
];

const MessagesSection = ({ onViewAll }: { onViewAll?: () => void }) => {
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

     
      <FlatList
        data={messagesData}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageCard}>
            <Image
              source={{
                uri: item.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={styles.avatar}
            />

            <View style={styles.messageInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.message} numberOfLines={1}>
                {item.message}
              </Text>
            </View>

            <View style={styles.rightCol}>
              <Text style={styles.time}>{item.time}</Text>
              {item.unread && <View style={styles.unreadDot} />}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MessagesSection;

/* ---------- Styles ---------- */
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

  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  messageInfo: { flex: 1 },
  name: { fontSize: 14, fontWeight: "700", color: "#111" },
  message: { fontSize: 12, color: "#555", marginTop: 2 },
  rightCol: { alignItems: "flex-end" },
  time: { fontSize: 11, color: "#999" },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3b82f6",
    marginTop: 4,
  },
});

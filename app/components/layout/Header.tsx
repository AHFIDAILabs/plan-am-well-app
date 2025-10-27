// app/components/layout/AppHeader.tsx
import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Image, Text, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from "../../context/AuthContext";
import { AppStackParamList } from "../../navigation/AppStack";
import { useThemeContext } from "../../context/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type UserProfileNavigationProp = StackNavigationProp<AppStackParamList, 'UserDashboard'>;

export default function AppHeader({
  onMenuToggle,
  drawerOpen,
}: {
  onMenuToggle?: () => void;
  drawerOpen: boolean;
}) {
  const { user } = useAuth();
  const { toggleTheme, isDark } = useThemeContext();
  const navigation = useNavigation<UserProfileNavigationProp>();

  // Animation value for hamburger ↔ X
  const anim = useRef(new Animated.Value(0)).current;

  // Sync animation with drawer state
  useEffect(() => {
    Animated.timing(anim, {
      toValue: drawerOpen ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [drawerOpen]);

  // Hamburger line transforms
  const topLineStyle = {
    transform: [
      { rotateZ: anim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "45deg"] }) },
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }) },
    ],
  };

  const middleLineStyle = {
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
  };

  const bottomLineStyle = {
    transform: [
      { rotateZ: anim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-45deg"] }) },
      { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
    ],
  };

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: isDark ? "#111" : "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: 0.5,
          borderBottomColor: isDark ? "#333" : "#ccc",
          backgroundColor: isDark ? "#111" : "#fff",
        }}
      >
      
        <TouchableOpacity
          onPress={onMenuToggle}
          style={{ width: 30, height: 24, justifyContent: "center" }}
        >
          <Animated.View
            style={[
              { height: 3, backgroundColor: isDark ? "#fff" : "#000", marginBottom: 5, borderRadius: 1.5 },
              topLineStyle,
            ]}
          />
          <Animated.View
            style={[
              { height: 3, backgroundColor: isDark ? "#fff" : "#000", marginBottom: 5, borderRadius: 1.5 },
              middleLineStyle,
            ]}
          />
          <Animated.View
            style={[
              { height: 3, backgroundColor: isDark ? "#fff" : "#000", borderRadius: 1.5 },
              bottomLineStyle,
            ]}
          />
        </TouchableOpacity>

        <Text style={{ fontWeight: "700", fontSize: 18, color: isDark ? "#fff" : "#000" }}>
          Welcome {user?.firstName?.split(" ")[0] ?? ""}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        
          <TouchableOpacity onPress={toggleTheme}>
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={22}
              color={isDark ? "#fff" : "#000"}
            />
          </TouchableOpacity>

         
       <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen" as never)}>
  <Image
    source={{
      uri:
        (user?.avatar && typeof user.avatar === "object" && user.avatar.url)
          ? user.avatar.url
          : (typeof user?.avatar === "string"
              ? user.avatar
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"),
    }}
    style={{
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: isDark ? "#555" : "#ddd",
    }}
  />
</TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

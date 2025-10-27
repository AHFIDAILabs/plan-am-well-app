import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useThemeContext } from "../../context/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";

type BottomNavigationBarProps = {
  active: "home" | "consult" | "shop" | "search" | "profile" | undefined;
};

export default function BottomNavigationBar({ active }: BottomNavigationBarProps) {
  const navigation = useNavigation();
  const { isDark } = useThemeContext();

  const tabs = [
    { key: "home", icon: "home-outline", label: "Home", route: "Home" },
    { key: "consult", icon: "chatbubbles-outline", label: "Consult", route: "ConsultScreen" },
    { key: "shop", icon: "cart-outline", label: "Shop", route: "ShopScreen" },
    { key: "search", icon: "search-outline", label: "Search", route: "SearchScreen" },
    { key: "profile", icon: "person-outline", label: "Profile", route: "ProfileScreen" },
  ];

  return (
    <SafeAreaView
      edges={[ ]}
      style={{
        backgroundColor: isDark ? "#000" : "#fff",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 35,
          borderTopWidth: 0.4,
          borderTopColor: isDark ? "#333" : "#ddd",
        }}
      >
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          const color = isActive
            ? isDark
              ? "#0af"
              : "#007AFF"
            : isDark
            ? "#888"
            : "#999";

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => navigation.navigate(tab.route as never)}
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={tab.icon as any} size={24} color={color} />
              <Text
                style={{
                  fontSize: 12,
                  marginTop: 2,
                  color,
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// app/components/layout/AppDrawer.tsx
import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // MaterialIcons was imported but not used, so I removed it for cleanup.
import { useThemeContext } from "../../context/ThemeProvider";
import { useAuth } from "../../context/AuthContext";

// Get the screen width to correctly calculate the drawer's hidden position
const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH_PERCENT = 0.7; // 70% width as defined in your style
const DRAWER_WIDTH = SCREEN_WIDTH * DRAWER_WIDTH_PERCENT;
// The starting (hidden) translateX value should be the full width of the drawer.
const HIDDEN_X = DRAWER_WIDTH;

export default function AppDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // 1. Use useRef to create the Animated.Value
  // Initialize to HIDDEN_X (the closed position)
  const translateX = useRef(new Animated.Value(HIDDEN_X)).current;
  const { isDark } = useThemeContext();
  const { user, logout } = useAuth();
  const [visible, setVisible] = React.useState(isOpen);

  // 2. Use useEffect to trigger the animation whenever the 'isOpen' prop changes
  useEffect(() => {
    if (isOpen) setVisible(true);

    // Determine the target position based on isOpen
    const toValue = isOpen ? 0 : HIDDEN_X;

    // Use Animated.timing for a smooth, controlled slide animation
    Animated.timing(translateX, {
      toValue,
      duration: 300, // Adjust duration for desired speed
      easing: Easing.out(Easing.ease), // Smooth out the animation
      useNativeDriver: true, // Use the native driver for performance
    }).start(() => {
      if (!isOpen) setVisible(false);
    });

    // The optional dependency array tells React to re-run this effect
    // only when 'isOpen' changes.
  }, [isOpen, translateX]);

  // 3. Define the animated style object
  const drawerStyle = {
    transform: [{ translateX: translateX }],
  };

  const menuItems = [
    { label: "Dashboard", icon: "home-outline" },
    { label: "Messages", icon: "chatbubbles-outline" },
    { label: "Settings", icon: "settings-outline" },
    { label: "Logout", icon: "log-out-outline", danger: true },
  ];

  // Optional: If the drawer is closed, return null to not render it,
  // which can prevent interactions while it's hidden.
  if (!visible) return null;

  return (
    <View
      // This wrapper allows the drawer to sit above other content
      // and controls whether it's touchable (though we rely on its position/style)
      style={{
        // The drawer's view should always cover the screen to block interactions outside of it
        ...(visible ? { flex: 1 } : { display: 'none' }),
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: isOpen ? 'rgba(0,0,0,0.5)' : 'transparent', // Optional: Add a dimming overlay
      }}
    >

      <TouchableOpacity 
        style={{ flex: 1 }} 
        onPress={onClose} 
        activeOpacity={1}
      />

      <Animated.View
        style={[
          {
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: DRAWER_WIDTH, // Use the constant
            backgroundColor: isDark ? "#111" : "#fff",
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowOffset: { width: -2, height: 0 },
            paddingHorizontal: 20,
            paddingTop: 60,
          },
          drawerStyle,
        ]}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", color: isDark ? "#fff" : "#000", marginBottom: 30 }}>
          Hello, {user?.firstName?.split(" ")[0] ?? "Guest"}
        </Text>

        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 24,
            }}
           onPress={() => {
      onClose(); // close the drawer first

      // Handle Logout specifically
      if (item.label === "Logout") {
        console.log("🚪 Logging out user...");
        logout(); // call from useAuth
      }
    }}
            
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              color={item.danger ? "red" : isDark ? "#fff" : "#000"}
              style={{ marginRight: 14 }}
            />
            <Text style={{ color: item.danger ? "red" : isDark ? "#fff" : "#000", fontSize: 16 }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}
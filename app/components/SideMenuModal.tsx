// src/components/SideMenuModal.tsx
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  Animated, // <-- Import Animated
  Easing,   // <-- Import Easing
} from "react-native";

import  {useAuth} from "../context/AuthContext";

// Removed reanimated imports

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = Math.min(360, width * 0.78);
const HIDDEN_X = DRAWER_WIDTH;

type MenuItem = {
  key: string;
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  footer?: React.ReactNode;
  avatar?: { uri?: string } | null;
  displayName?: string | null;
};

export default function SideMenuModal({
  visible,
  onClose,
  menuItems,
  footer,
  avatar,
  displayName,
}: Props) {
  // 1. Replace useSharedValue with useRef for Animated.Value
  // Initialize to the hidden position based on visibility
  const slideAnim = useRef(new Animated.Value(visible ? 0 : HIDDEN_X)).current;
  const opacityAnim = useRef(new Animated.Value(visible ? 0.5 : 0)).current;

  // 2. Use a local state to control rendering only when animating
  const [shouldRender, setShouldRender] = React.useState(visible);
  const { logout } = useAuth();
  
  // 3. Use useEffect to run the animations when 'visible' changes
  React.useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // Panel slide-in: HIDDEN_X -> 0
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
      // Overlay fade-in: 0 -> 0.5
      Animated.timing(opacityAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Panel slide-out: 0 -> HIDDEN_X
      Animated.timing(slideAnim, {
        toValue: HIDDEN_X,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => setShouldRender(false)); // Hide only after animation finishes
      // Overlay fade-out: 0.5 -> 0
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, opacityAnim]);

  // Don't render if the animation is not running and it should be hidden
  if (!shouldRender) {
    return null;
  }
  
  // 4. Define the standard animated style objects
  const overlayStyle = {
    opacity: opacityAnim,
  };

  const panelStyle = {
    transform: [{ translateX: slideAnim }],
  };

  return (
    <View style={styles.wrapper} pointerEvents={visible ? "auto" : "none"}>
      <Pressable style={styles.overlayTouchable} onPress={onClose}>

        <Animated.View style={[styles.overlay, overlayStyle]} />
      </Pressable>

      <Animated.View style={[styles.panel, panelStyle]}>
        <View style={styles.header}>
          {avatar?.uri ? (
            <Image source={{ uri: avatar.uri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {displayName ? displayName[0].toUpperCase() : "U"}
              </Text>
            </View>
          )}
          <View style={styles.headerText}>
            <Text style={styles.nameText}>{displayName ?? "You"}</Text>
            <Text style={styles.subText}>PlanAmWell</Text>
          </View>
        </View>

        <View style={styles.items}>
          {menuItems.map((it) => (
            <TouchableOpacity
              key={it.key}
              style={styles.item}
              onPress={() => {
                it.onPress();
                onClose();
              }}
            >
              {it.icon ?? null}
              <Text style={styles.itemLabel}>{it.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          {footer}
        </View>
      </Animated.View>
    </View>
  );
}

// ... styles remain the same
const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  overlayTouchable: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  panel: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: -8, height: 0 },
    shadowRadius: 20,
    elevation: 20,
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: "700",
    color: "#444",
  },
  headerText: {
    flex: 1,
  },
  nameText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
  },
  subText: {
    color: "#666",
    marginTop: 2,
    fontSize: 12,
  },
  items: {
    marginTop: 18,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  itemLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#111",
  },
  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
});
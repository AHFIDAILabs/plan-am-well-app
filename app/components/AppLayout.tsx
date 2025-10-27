// src/components/AppLayout.tsx
import React, { useState } from "react";
import { View, StyleSheet} from "react-native";
import Header from "./layout/Header";                 // your header component
import BottomNavigationBar from "./layout/BottomNavBar";
import AppDrawer from "./layout/AppDrawer";           // make sure this path is correct
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  activeTab?: "home" | "consult" | "shop" | "search" | "profile" | undefined;
  // Optional: allow overriding whether the header should show the hamburger, etc.
  showHeader?: boolean;
  showBottom?: boolean;
};

export default function AppLayout({
  children,
  activeTab,
  showHeader = true,
  showBottom = true,
}: Props) {
  // AppLayout now owns the drawer state, and toggles it for Header & Drawer.
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggleDrawer = () => setDrawerOpen((s) => !s);
  const handleCloseDrawer = () => setDrawerOpen(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {showHeader && (
          // Pass drawerOpen and onMenuToggle to Header so it can animate the hamburger.
          <Header onMenuToggle={handleToggleDrawer} drawerOpen={drawerOpen} />
        )}

        {/* Main content */}
        <View style={styles.content}>{children}</View>

        {showBottom && <BottomNavigationBar active={activeTab} />}

        {/* Render drawer at top-level of layout so it overlays everything */}
        <AppDrawer isOpen={drawerOpen} onClose={handleCloseDrawer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9f9f9" },
  container: { flex: 1 },
  content: { flex: 1 },
});

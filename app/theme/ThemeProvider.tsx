// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import { useColorScheme } from "react-native";
import { Appearance } from "react-native";

type ThemeName = "light" | "dark";

type Theme = {
  name: ThemeName;
  colors: {
    background: string;
    card: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    border: string;
    muted: string;
  };
};

const light: Theme = {
  name: "light",
  colors: {
    background: "#ffffff",
    card: "#fffdf9",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    accent: "#F97316",
    border: "#e6e7ea",
    muted: "#9ca3af",
  },
};

const dark: Theme = {
  name: "dark",
  colors: {
    background: "#0b1220",
    card: "#0f1724",
    textPrimary: "#ffffff",
    textSecondary: "#cbd5e1",
    accent: "#FBBF24",
    border: "#1f2937",
    muted: "#9ca3af",
  },
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const sys = useColorScheme();
  const [mode, setMode] = useState<ThemeName>(sys === "dark" ? "dark" : "light");

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      // keep user choice if they've toggled manually — optional behavior:
      // If you want system to override always, uncomment next line:
      // setMode(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => sub.remove();
  }, []);

  const toggleTheme = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  const theme = useMemo(() => (mode === "dark" ? dark : light), [mode]);

  return <ThemeContext.Provider value={{ theme, toggleTheme, isDark: mode === "dark" }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

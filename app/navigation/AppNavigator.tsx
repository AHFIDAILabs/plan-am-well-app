import React from "react";
import { useAuth } from "../context/AuthContext";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import SplashScreen from "../components/SplashScreen";

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <SplashScreen />;

  return user ? <AppStack /> : <AuthStack />;
}

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
// import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import OnboardScreen from "../screens/welcome/OnboardScreen"

// 1️⃣ Define your param list (typed navigation)
export type AuthStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Welcome: undefined;
  Onboarding: undefined;

};

// 2️⃣ Create the stack
const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
        <Stack.Screen name="Onboarding" component={OnboardScreen} />

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserDashboardScreen from "../screens/dashboards/UserDashboardScreen";
import ProfileScreen from "../screens/profiles/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import { FindDoctorScreen } from "../screens/findServices/FindDoctorScreen";

// import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";

// 1️⃣ Define your param list (typed navigation)
export type AppStackParamList = {
Home: undefined;
UserDashboard: undefined;
ProfileScreen: {userId: string | undefined};
DoctorProfile: {userId: string | undefined};
  ForgotPassword: undefined;
  Welcome: undefined;
  FindDoctor: undefined;

};

// 2️⃣ Create the stack
const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
            <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="FindDoctor" component={FindDoctorScreen} />
    </Stack.Navigator>
  );
}

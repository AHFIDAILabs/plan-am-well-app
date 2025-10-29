// App.tsx
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { ThemeProvider, useThemeContext } from "./app/context/ThemeProvider";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./app/context/AuthContext";
import AppNavigator from "./app/navigation/AppNavigator";
import Toast from "react-native-toast-message";

function MainApp() {
  const { theme } = useThemeContext();
  return (
    <NavigationContainer theme={theme}>
      <AppNavigator />
      <Toast position="top" topOffset={50} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}

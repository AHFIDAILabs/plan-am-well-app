import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { useAuth } from "../../context/AuthContext";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { signInWithGoogle } from "../../services/GoogleAuthService";
import Toast from "react-native-toast-message";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { login, setAuthTokens, setUser, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateInputs = () => {
    let valid = true;
    setEmailError(""); 
    setPasswordError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { 
      setEmailError("Enter valid email"); 
      valid = false; 
      Toast.show({ type: "error", text1: "Enter valid email" });
    }
    if (password.length < 6) { 
      setPasswordError("Password must be at least 6 chars"); 
      valid = false; 
      Toast.show({ type: "error", text1: "Password must be at least 6 chars" });
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    try {
      await login(email, password);
      Toast.show({ type: "success", text1: "Logged in successfully" });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: err?.response?.data?.message || "Invalid credentials",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSocialLoading(true);
    try {
      const result = await signInWithGoogle("user"); // adjust role if needed
      if (result) {
        setAuthTokens(result.tokens.accessToken, result.tokens.refreshToken);
        setUser(result.user);
        Toast.show({ type: "success", text1: "Logged in with Google" });
      } else {
        Toast.show({ type: "error", text1: "Google sign-in canceled" });
      }
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Google sign-in failed", text2: err.message });
    } finally {
      setIsSocialLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient colors={["#1a1f2b","#121212","#0a0a0a"]} style={{ flex:1 }}>
        <ImageBackground source={require("../../../assets/splash.jpg")} resizeMode="cover" style={{ flex: 1 }} imageStyle={{ opacity: 0.08 }}>
          <View style={styles.topSection}>
            <Text style={styles.brandTitle}>Plan Am Well 🧬</Text>
            <Text style={styles.subtitle}>Welcome Back 👋</Text>
          </View>

          <Animated.View style={[styles.formCard, {opacity: fadeAnim, transform: [{translateY: slideAnim}]}]}>
            <LinearGradient colors={["rgba(255,255,255,0.15)","rgba(255,255,255,0.05)"]} style={styles.glassBackground}>
              <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

                <TextInput
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  style={[styles.input, emailError ? { borderColor: "#ff6b6b" } : {}]}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <View style={{ position: "relative" }}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    style={[styles.input, passwordError ? { borderColor: "#ff6b6b" } : {}]}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="rgba(255,255,255,0.6)" />
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <TouchableOpacity disabled={loading || isSocialLoading} onPress={handleLogin} style={[styles.button, (loading || isSocialLoading) && { opacity: 0.7 }]}>
                  <LinearGradient colors={["#00f5d4","#00bbf9","#4361ee"]} style={styles.buttonGradient}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.socialContainer}>
                  <Text style={styles.socialDivider}>or continue with</Text>
                  <View style={styles.socialButtons}>
                    <TouchableOpacity onPress={handleGoogleSignIn} style={[styles.socialButton, { borderColor: "#DB4437" }]} disabled={loading || isSocialLoading}>
                      {isSocialLoading ? <ActivityIndicator size="small" color="#DB4437" /> : <FontAwesome name="google" size={22} color="#DB4437" />}
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.registerContainer}>
                  <Text style={styles.registerText}>
                    Don’t have an account? <Text style={styles.registerLink}>Register</Text>
                  </Text>
                </TouchableOpacity>

              </ScrollView>
            </LinearGradient>
          </Animated.View>
        </ImageBackground>
      </LinearGradient>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topSection: { flex: 0.25, justifyContent: "flex-end", alignItems: "center", paddingBottom: 30 },
  brandTitle: { fontSize: 36, fontWeight: "800", color: "#fff" },
  subtitle: { fontSize: 22, color: "#cfcfcf", marginTop: 8, fontWeight: "600" },
  formCard: { flex: 0.75, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: "hidden", shadowColor: "#00f5d4", shadowOpacity: 0.25, shadowOffset: { width: 0, height: -4 }, shadowRadius: 20, elevation: 15 },
  glassBackground: { flex: 1, padding: 24, borderRadius: 30, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
  input: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 18, marginBottom: 14, fontSize: 16, color: "#fff", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  eyeIcon: { position: "absolute", right: 16, top: 18 },
  errorText: { color: "#ff6b6b", marginBottom: 10, fontSize: 13 },
  button: { borderRadius: 12, overflow: "hidden", marginTop: 12 },
  buttonGradient: { paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  socialContainer: { marginTop: 28, alignItems: "center" },
  socialDivider: { color: "rgba(255,255,255,0.6)", marginBottom: 16, fontSize: 14 },
  socialButtons: { flexDirection: "row", justifyContent: "center", gap: 20 },
  socialButton: { borderWidth: 1.2, padding: 12, borderRadius: 50, width: 50, height: 50, alignItems: "center", justifyContent: "center" },
  registerContainer: { marginTop: 25 },
  registerText: { textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: 15 },
  registerLink: { color: "#00f5d4", fontWeight: "700" },
});

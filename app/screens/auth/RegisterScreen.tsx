import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { useAuth } from "../../context/AuthContext";
import { RegisterPayload } from "../../types/AuthType";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { signInWithGoogle } from "../../services/GoogleAuthService";

const { height, width } = Dimensions.get("window");

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { register, setAuthTokens, setUser, loading } = useAuth();
  const [role, setRole] = useState<"User" | "Doctor">("User");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const [form, setForm] = useState<any>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    specialization: "",
    qualifications: "",
    experienceYears: "",
    bio: "",
  });

  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
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

  const handleChange = (key: string, value: string) =>
    setForm((prev: any) => ({ ...prev, [key]: value }));

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate)
      handleChange("dob", selectedDate.toISOString().split("T")[0]);
  };

  const validateForm = () => {
    if (!form.firstName || !form.lastName) {
      Toast.show({ type: "error", text1: "Name required" });
      return false;
    }
    if (!form.email) {
      Toast.show({ type: "error", text1: "Email is required" });
      return false;
    }
    if (!form.password || !form.confirmPassword) {
      Toast.show({ type: "error", text1: "Password & Confirm Password required" });
      return false;
    }
    if (form.password !== form.confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match" });
      return false;
    }
    if (!form.gender) {
      Toast.show({ type: "error", text1: "Please select your gender" });
      return false;
    }
    if (role === "User" && !form.dob) {
      Toast.show({ type: "error", text1: "Please select Date of Birth" });
      return false;
    }
    if (role === "Doctor") {
      if (!form.specialization) {
        Toast.show({ type: "error", text1: "Specialization required" });
        return false;
      }
      if (!form.qualifications) {
        Toast.show({ type: "error", text1: "Qualifications required" });
        return false;
      }
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const payload: RegisterPayload = {
        ...form,
        role: role.toLowerCase(),
        qualifications:
          role === "Doctor" && form.qualifications
            ? form.qualifications.split(",").map((q: string) => q.trim())
            : undefined,
      };
      await register(payload);
      Toast.show({ type: "success", text1: "Registered successfully" });
      navigation.navigate("Login");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: err?.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSocialLoading(true);
    try {
      const result = await signInWithGoogle(role.toLowerCase() as "user" | "doctor");
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
      <LinearGradient colors={["#1a1f2b", "#121212", "#0a0a0a"]} style={{ flex: 1 }}>
        <ImageBackground
          source={require("../../../assets/splash.jpg")}
          resizeMode="cover"
          style={{ flex: 1 }}
          imageStyle={{ opacity: 0.08 }}
        >
          <View style={styles.topSection}>
            <Text style={styles.brandTitle}>Plan Am Well 🧬</Text>
            <Text style={styles.subtitle}>
              {role === "User" ? "Create Your Account ✨" : "Join as a Doctor 👩🏽‍⚕️"}
            </Text>
          </View>

          <Animated.View
            style={[styles.formCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]}
              style={styles.glassBackground}
            >
              <ScrollView contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
                <View style={styles.roleSwitchContainer}>
                  {["User", "Doctor"].map((r) => (
                    <TouchableOpacity
                      key={r}
                      onPress={() => setRole(r as "User" | "Doctor")}
                      style={[styles.roleButton, role === r && styles.roleButtonActive]}
                    >
                      <Text style={[styles.roleText, role === r && styles.roleTextActive]}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Names */}
                <TextInput
                  placeholder="First Name"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  autoCapitalize="sentences"
                  value={form.firstName}
                  onChangeText={(v) => handleChange("firstName", v)}
                  style={[styles.input, styles.halfInput]}
                />
                <TextInput
                  placeholder="Last Name"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  autoCapitalize="sentences"
                  value={form.lastName}
                  onChangeText={(v) => handleChange("lastName", v)}
                  style={[styles.input, styles.halfInput]}
                />

                {/* Email & Phone */}
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(v) => handleChange("email", v)}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Phone"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={(v) => handleChange("phone", v)}
                  style={styles.input}
                />

                {/* Gender */}
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Gender</Text>
                  <Picker
                    selectedValue={form.gender}
                    onValueChange={(itemValue) => handleChange("gender", itemValue)}
                    style={styles.picker}
                    dropdownIconColor="#ccc"
                  >
                    <Picker.Item label="" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>
                </View>

                {/* Password */}
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    secureTextEntry={!showPassword}
                    value={form.password}
                    onChangeText={(v) => handleChange("password", v)}
                    style={[styles.input, { flex: 1 }]}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye" : "eye-off"} size={22} color="#ccc" />
                  </TouchableOpacity>
                </View>

                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    secureTextEntry={!showConfirmPassword}
                    value={form.confirmPassword}
                    onChangeText={(v) => handleChange("confirmPassword", v)}
                    style={[styles.input, { flex: 1 }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={22} color="#ccc" />
                  </TouchableOpacity>
                </View>

                {/* User Fields */}
                {role === "User" && (
                  <>
                    <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                      <Text style={{ color: form.dob ? "#fff" : "rgba(255,255,255,0.6)" }}>
                        {form.dob || "Select Date of Birth"}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={form.dob ? new Date(form.dob) : new Date(2000, 0, 1)}
                        mode="date"
                        maximumDate={new Date()}
                        onChange={handleDateChange}
                      />
                    )}
                    <TextInput
                      placeholder="Blood Group (e.g. O+)"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={form.bloodGroup}
                      onChangeText={(v) => handleChange("bloodGroup", v)}
                      style={styles.input}
                    />
                  </>
                )}

                {/* Doctor Fields */}
                {role === "Doctor" && (
                  <>
                    <TextInput
                      placeholder="Specialization"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={form.specialization}
                      onChangeText={(v) => handleChange("specialization", v)}
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="Qualifications (comma-separated)"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={form.qualifications}
                      onChangeText={(v) => handleChange("qualifications", v)}
                      style={styles.input}
                    />
                    <TextInput
                      placeholder="Years of Experience"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={form.experienceYears}
                      onChangeText={(v) => handleChange("experienceYears", v)}
                      style={styles.input}
                      keyboardType="numeric"
                    />
                    <TextInput
                      placeholder="Short Bio"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={form.bio}
                      onChangeText={(v) => handleChange("bio", v)}
                      style={[styles.input, { textAlignVertical: "top" }]}
                      multiline
                      numberOfLines={3}
                    />
                  </>
                )}

                {/* Register Button */}
                <TouchableOpacity
                  disabled={loading || isSocialLoading}
                  onPress={handleRegister}
                  style={[styles.button, (loading || isSocialLoading) && { opacity: 0.7 }]}
                >
                  <LinearGradient colors={["#00f5d4", "#00bbf9", "#4361ee"]} style={styles.buttonGradient}>
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>
                        {role === "User" ? "Register" : "Join as Doctor"}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Social Sign-In */}
                <View style={styles.socialContainer}>
                  <Text style={styles.orText}>or sign up with</Text>
                  <View style={styles.socialRow}>
                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={handleGoogleSignIn}
                      disabled={loading || isSocialLoading}
                    >
                      {isSocialLoading ? (
                        <ActivityIndicator size="small" color="#DB4437" />
                      ) : (
                        <FontAwesome name="google" size={26} color="#DB4437" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Login link */}
                <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginContainer}>
                  <Text style={styles.loginText}>
                    Already have an account? <Text style={styles.loginLink}>Login</Text>
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
  brandTitle: { fontSize: 34, fontWeight: "800", color: "#fff" },
  subtitle: { fontSize: 20, color: "#ccc", marginTop: 6 },
  formCard: { flex: 0.75, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: "hidden" },
  glassBackground: { flex: 1, padding: 24, borderRadius: 30, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
  roleSwitchContainer: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, marginBottom: 20 },
  roleButton: { flex: 1, paddingVertical: 12, alignItems: "center" },
  roleButtonActive: { backgroundColor: "rgba(255,255,255,0.3)" },
  roleText: { color: "#fff", fontWeight: "600" },
  roleTextActive: { color: "#00f5d4" },
  input: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 16, marginBottom: 12, color: "#fff" },
  halfInput: { width: "48.5%", marginBottom: 12 },
  passwordContainer: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  eyeIcon: { position: "absolute", right: 15, top: 18 },
  pickerContainer: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, marginBottom: 12, paddingHorizontal: 16, minHeight: 50, justifyContent: "center" },
  pickerLabel: { color: "rgba(255,255,255,0.6)", fontSize: 12, position: "absolute", top: 6, left: 18, zIndex: 1 },
  picker: { height: 50, color: "#fff" },
  button: { borderRadius: 12, overflow: "hidden", marginTop: 14 },
  buttonGradient: { paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  socialContainer: { marginTop: 25, alignItems: "center" },
  orText: { color: "rgba(255,255,255,0.7)", marginBottom: 10 },
  socialRow: { flexDirection: "row", gap: 14 },
  socialButton: { backgroundColor: "rgba(255,255,255,0.08)", padding: 12, borderRadius: 50 },
  loginContainer: { marginTop: 25 },
  loginText: { textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 15 },
  loginLink: { color: "#00f5d4", fontWeight: "700" },
});

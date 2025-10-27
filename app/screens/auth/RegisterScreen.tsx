import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
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
    gender: "Male",
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
    if (selectedDate) handleChange("dob", selectedDate.toISOString().split("T")[0]);
  };

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.confirmPassword)
      return Alert.alert("Missing fields", "Please fill all required fields");

    if (form.password !== form.confirmPassword)
      return Alert.alert("Password mismatch", "Passwords do not match");
      
    if (!form.gender || form.gender === "")
      return Alert.alert("Missing field", "Please select your gender.");

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
    } catch (err: any) {
      Alert.alert("Registration failed", err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSocialLoading(true);
    try {
      const result = await signInWithGoogle(role.toLowerCase() as "user" | "doctor");
      if (result) {
        setAuthTokens(result.tokens.accessToken, result.tokens.refreshToken);
        setUser(result.user);
      } else {
        Alert.alert("Canceled", "Google sign-in was not completed.");
      }
    } catch (err: any) {
      Alert.alert("Sign-In Failed", err.message || "Google auth failed.");
    } finally {
      setIsSocialLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <LinearGradient colors={["#1a1f2b", "#121212", "#0a0a0a"]} style={{ flex: 1 }}>
        <ImageBackground source={require("../../../assets/splash.jpg")} resizeMode="cover" style={{ flex: 1 }} imageStyle={{ opacity: 0.08 }}>
          
          <View style={styles.topSection}>
            <Text style={styles.brandTitle}>Plan Am Well 🧬</Text>
            <Text style={styles.subtitle}>{role === "User" ? "Create Your Account ✨" : "Join as a Doctor 👩🏽‍⚕️"}</Text>
          </View>

          <Animated.View style={[styles.formCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <LinearGradient colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]} style={styles.glassBackground}>
              <ScrollView contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
                
                <View style={styles.roleSwitchContainer}>
                  {["User", "Doctor"].map(r => (
                    <TouchableOpacity key={r} onPress={() => setRole(r as "User" | "Doctor")} style={[styles.roleButton, role === r && styles.roleButtonActive]}>
                      <Text style={[styles.roleText, role === r && styles.roleTextActive]}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                
                {/* 🛠️ FIX: Combine First Name and Last Name into a single row to save space */}
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="First Name"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        autoCapitalize="sentences"
                        value={form.firstName}
                        onChangeText={(v) => handleChange("firstName", v)}
                        style={[styles.input, styles.halfInput, { marginBottom: 0 }]}
                    />
                    <TextInput
                        placeholder="Last Name"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        autoCapitalize="sentences"
                        value={form.lastName}
                        onChangeText={(v) => handleChange("lastName", v)}
                        style={[styles.input, styles.halfInput, { marginBottom: 0 }]}
                    />
                </View>

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

                
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    secureTextEntry={!showPassword}
                    value={form.password}
                    onChangeText={(v) => handleChange("password", v)}
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeIcon}>
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
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(prev => !prev)} style={styles.eyeIcon}>
                    <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={22} color="#ccc" />
                  </TouchableOpacity>
                </View>

              <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Gender</Text>
                  <Picker
                      selectedValue={form.gender}
                      onValueChange={(itemValue) => handleChange("gender", itemValue)}
                      style={styles.picker}
                      dropdownIconColor="#ccc"
                  >
                      <Picker.Item label="Select Gender" value="" style={styles.pickerItem} />
                      <Picker.Item label="Male" value="Male" style={styles.pickerItem} />
                      <Picker.Item label="Female" value="Female" style={styles.pickerItem} />
                      <Picker.Item label="Other" value="Other" style={styles.pickerItem} />
                  </Picker>
              </View>

                
                {role === "User" ? (
                  <>
                    <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                      <Text style={{ color: form.dob ? "#fff" : "rgba(255,255,255,0.6)" }}>{form.dob || "Select Date of Birth"}</Text>
                    </TouchableOpacity>
                    {showDatePicker && <DateTimePicker value={form.dob ? new Date(form.dob) : new Date(2000,0,1)} mode="date" maximumDate={new Date()} onChange={handleDateChange} />}
                    <TextInput placeholder="Blood Group (e.g. O+)" placeholderTextColor="rgba(255,255,255,0.6)" value={form.bloodGroup} onChangeText={(v) => handleChange("bloodGroup", v)} style={styles.input} />
                  </>
                ) : (
                  <>
                    <TextInput placeholder="Specialization" placeholderTextColor="rgba(255,255,255,0.6)" value={form.specialization} onChangeText={(v) => handleChange("specialization", v)} style={styles.input} />
                    <TextInput placeholder="Qualifications (comma-separated)" placeholderTextColor="rgba(255,255,255,0.6)" value={form.qualifications} onChangeText={(v) => handleChange("qualifications", v)} style={styles.input} />
                    <TextInput placeholder="Years of Experience" placeholderTextColor="rgba(255,255,255,0.6)" value={form.experienceYears} onChangeText={(v) => handleChange("experienceYears", v)} style={styles.input} keyboardType="numeric" />
                    <TextInput placeholder="Short Bio" placeholderTextColor="rgba(255,255,255,0.6)" value={form.bio} onChangeText={(v) => handleChange("bio", v)} style={[styles.input, { textAlignVertical: "top" }]} multiline numberOfLines={3} />
                  </>
                )}

                <TouchableOpacity disabled={loading || isSocialLoading} onPress={handleRegister} style={[styles.button, (loading || isSocialLoading) && { opacity: 0.7 }]}>
                  <LinearGradient colors={["#00f5d4", "#00bbf9", "#4361ee"]} style={styles.buttonGradient}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{role === "User" ? "Register" : "Join as Doctor"}</Text>}
                  </LinearGradient>
                </TouchableOpacity>

                
                <View style={styles.socialContainer}>
                  <Text style={styles.orText}>or sign up with</Text>
                  <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn} disabled={loading || isSocialLoading}>
                      {isSocialLoading ? <ActivityIndicator size="small" color="#DB4437" /> : <FontAwesome name="google" size={26} color="#DB4437" />}
                    </TouchableOpacity>
                  </View>
                </View>

              
                <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
                </TouchableOpacity>
              </ScrollView>
            </LinearGradient>
          </Animated.View>
        </ImageBackground>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

// ----------------------
// Styles
// ----------------------
const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
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
  
  // Base Input Style
  input: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 16, marginBottom: 12, color: "#fff" },
  
  passwordContainer: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  eyeIcon: { position: "absolute", right: 15, top: 18 },
  
  // New Picker Styles
  pickerContainer: {
    backgroundColor: "rgba(255,255,255,0.05)", 
    borderRadius: 12, 
    marginBottom: 12, 
    paddingHorizontal: 16, 
    paddingTop: 4,
    minHeight: 50,
  },
  pickerLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    position: 'absolute',
    top: 6,
    left: 18,
    zIndex: 1,
  },
  picker: {
    height: 50,
    color: '#fff',
    transform: Platform.OS === 'android' ? [] : [{ scaleX: 1.05 }], // Adjust scale for iOS appearance
    marginTop: 5,
    marginBottom: 5,
  },
  pickerItem: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'transparent', // Ensure item color is visible over the modal/dropdown
  },

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

  // 🛠️ NEW STYLES ADDED FOR RESPONSIVE FLOW
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfInput: {
    width: '48.5%',
    marginBottom: 0, 
    padding: 14, 
  },
});
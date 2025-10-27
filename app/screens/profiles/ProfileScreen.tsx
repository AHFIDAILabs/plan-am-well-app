import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeProvider";
import UserProfileInfo from "../../components/UserProfileInfo";
import DoctorExtraInfo from "../../components/DoctorExtraInfo";
import AppLayout from "../../components/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateProfile, UpdateProfilePayload } from "../../services/AuthService";
import { User, Doctor } from "../../types/UserType";

const { height } = Dimensions.get("window");

type ProfileForm = {
  firstName: string;
  lastName: string;
  phone: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressCountry: string;
  specialization: string;
  qualifications: string;
  experienceYears: string;
  bio: string;
  consultationFee: string;
  availability: string;
};

const initializeForm = (user: User | Doctor | null): ProfileForm => ({
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  phone: user?.phone || "",
  addressStreet: user?.address?.street || "",
  addressCity: user?.address?.city || "",
  addressState: user?.address?.state || "",
  addressCountry: user?.address?.country || "",
  specialization: (user as Doctor)?.specialization || "",
  qualifications: (user as Doctor)?.qualifications?.join(", ") || "",
  experienceYears: (user as Doctor)?.experienceYears?.toString() || "",
  bio: (user as Doctor)?.bio || "",
  consultationFee: (user as Doctor)?.consultationFee?.toString() || "",
  availability: Array.isArray((user as Doctor)?.availability)
    ? (user as Doctor).availability!.map((slot) => `${slot.day}:${slot.from}-${slot.to}`).join("; ")
    : "",
});

export default function ProfileScreen() {
  const { user, setUser, refreshSession } = useAuth();
  const { isDark, theme } = useThemeContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<any>(null);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const isDoctor = user?.role?.toLowerCase() === "doctor";

  const [form, setForm] = useState<ProfileForm>(initializeForm(user));

  const logAvatarState = (label: string, avatarData: any, userData: User | Doctor | null) => {
    console.log(`\n[Avatar Debug] ${label}`);
    console.log("Avatar state:", avatarData);
    console.log("User.avatar:", userData?.avatar);
  };

  const openModal = () => {
    setForm(initializeForm(user));
    setAvatar(null);
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 350,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const pickAvatar = async () => {
    console.log("[Avatar Debug] Picking avatar...");
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Need media library permission to pick an image.");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    console.log("[Avatar Debug] ImagePicker result:", res);

    if (!res.canceled && res.assets && res.assets.length > 0) {
      setAvatar(res.assets[0]);
      logAvatarState("After pickAvatar -> setAvatar", res.assets[0], user);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload: UpdateProfilePayload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        address: {
          street: form.addressStreet.trim(),
          city: form.addressCity.trim(),
          state: form.addressState.trim(),
          country: form.addressCountry.trim(),
        },
      };

      if (isDoctor) {
        payload.specialization = form.specialization?.trim();
        payload.qualifications = form.qualifications
          ?.split(",")
          .map((q) => q.trim())
          .filter(Boolean);
        payload.experienceYears = Number(form.experienceYears) || undefined;
        payload.bio = form.bio?.trim();
        payload.consultationFee = Number(form.consultationFee) || undefined;
        payload.availability = form.availability
          ?.split(";")
          .map((slot) => {
            const [day, times] = slot.split(":").map((s) => s.trim());
            const [from, to] = times?.split("-").map((t) => t.trim()) || [];
            return day && from && to ? { day, from, to } : null;
          })
          .filter((slot): slot is { day: string; from: string; to: string } => slot !== null);
      }

      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([key, value]) => {
          if (Array.isArray(value)) return true;
          return value !== undefined && value !== "";
        })
      );

      console.log("[Update Profile] Payload:", cleanedPayload);
      console.log("[Avatar Debug] Avatar being sent:", avatar);

      try {
        const response = await updateProfile(cleanedPayload, avatar);
        console.log("[Avatar Debug] updateProfile response:", response);

        if (response && response.user) {
          setUser(response.user);
          setAvatar(null);
          logAvatarState("After setUser(response.user) and clearing temp avatar", null, response.user);
          Alert.alert("Success", response.message || "Profile updated.");
          closeModal();
        } else {
          throw new Error("Invalid response structure from server.");
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.log("[Auth Debug] 401 error, attempting token refresh");
          const tokens = await refreshSession();
          if (tokens) {
            console.log("[Auth Debug] Token refresh successful, retrying update");
            const retryResponse = await updateProfile(cleanedPayload, avatar);
            if (retryResponse && retryResponse.user) {
              setUser(retryResponse.user);
              setAvatar(null);
              logAvatarState("After retry setUser and clearing temp avatar", null, retryResponse.user);
              Alert.alert("Success", retryResponse.message || "Profile updated.");
              closeModal();
              return;
            }
          }
          throw new Error("Token refresh failed");
        }
        throw err;
      }
    } catch (err: any) {
      console.error("[Update Profile] Update failed:", err);
      const errorMessage = err?.response?.data?.message || err.message || "Unknown error";
      Alert.alert("Update Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    key: keyof ProfileForm,
    label: string,
    keyboardType: "default" | "numeric" = "default",
    multiline: boolean = false
  ) => (
    <View key={key} style={{ marginBottom: 14 }}>
      <Text style={{ color: theme.colors.text, marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={form[key]}
        onChangeText={(text) => setForm({ ...form, [key]: text })}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#888"
        keyboardType={keyboardType}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          {
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: isDark ? "#333" : "#fafafa",
          },
        ]}
      />
    </View>
  );

  const simpleFields: (keyof ProfileForm)[] = ["firstName", "lastName", "phone"];
  const addressFields = [
    { key: "addressStreet", label: "Street" },
    { key: "addressCity", label: "City" },
    { key: "addressState", label: "State" },
    { key: "addressCountry", label: "Country" },
  ] as const;
  const doctorFields: { key: keyof ProfileForm; label: string; type?: "number" | "multiline" }[] = [
    { key: "specialization", label: "Specialization" },
    { key: "qualifications", label: "Qualifications (e.g., MBBS, MD)", type: "multiline" },
    { key: "experienceYears", label: "Years of Experience", type: "number" },
    { key: "consultationFee", label: "Consultation Fee (USD)", type: "number" },
    { key: "bio", label: "Biography", type: "multiline" },
    { key: "availability", label: "Availability (e.g., Monday:09:00-17:00;Tuesday:10:00-18:00)", type: "multiline" },
  ];

  if (!user) {
    return (
      <AppLayout activeTab="profile">
        <View style={styles.center}>
          <Text style={{ color: theme.colors.text }}>No user data found</Text>
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeTab="profile">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 100 }}
      >
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <TouchableOpacity onPress={openModal}>
            <Image
              source={{
                uri: avatar
                  ? avatar.uri
                  : typeof user.avatar === "string"
                  ? user.avatar
                  : user.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                cache: "reload",
              }}
              style={{
                width: 110,
                height: 110,
                borderRadius: 60,
                marginBottom: 12,
                borderWidth: 3,
                borderColor: theme.colors.primary,
              }}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: "700", color: theme.colors.text }}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.primary, textTransform: "capitalize" }}>
            {user.role}
          </Text>
          <TouchableOpacity onPress={openModal} style={{ marginTop: 8 }}>
            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <UserProfileInfo user={user} isDark={isDark} />
        {isDoctor && <DoctorExtraInfo doctor={user as Doctor} isDark={isDark} />}
      </ScrollView>
      {modalVisible && (
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
              backgroundColor: isDark ? "#222" : "#fff",
            },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Edit Profile</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>
              <TouchableOpacity
                onPress={pickAvatar}
                style={{ alignSelf: "center", marginVertical: 10 }}
              >
                <Image
                  source={{
                    uri: avatar
                      ? avatar.uri
                      : typeof user.avatar === "string"
                      ? user.avatar
                      : user.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    cache: "reload",
                  }}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
                <Text style={{ textAlign: "center", marginTop: 4, color: theme.colors.primary }}>
                  Change Avatar
                </Text>
              </TouchableOpacity>
              {simpleFields.map((field) => renderInput(field, field.charAt(0).toUpperCase() + field.slice(1)))}
              <Text style={{ color: theme.colors.text, marginBottom: 6, marginTop: 10, fontWeight: "600" }}>
                Address
              </Text>
              {addressFields.map(({ key, label }) => renderInput(key, label))}
              {isDoctor && (
                <>
                  <Text style={{ color: theme.colors.text, marginBottom: 6, marginTop: 10, fontWeight: "600" }}>
                    Professional Information
                  </Text>
                  {doctorFields.map(({ key, label, type }) =>
                    renderInput(key, label, type === "number" ? "numeric" : "default", type === "multiline")
                  )}
                </>
              )}
              <TouchableOpacity
                disabled={loading}
                onPress={handleSave}
                style={[styles.saveBtn, { backgroundColor: theme.colors.primary }]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: "15%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveBtn: {
    marginTop: 10,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
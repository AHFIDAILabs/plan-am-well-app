// components/UserProfileInfo.tsx
import React from "react";
import { View, Text } from "react-native";

type Props = {
  user: any;
  isDark: boolean;
};

export default function UserProfileInfo({ user, isDark }: Props) {
  const colors = {
    bg: isDark ? "#1E1E1E" : "#fff",
    text: isDark ? "#fff" : "#000",
    label: isDark ? "#aaa" : "#555",
    border: isDark ? "#333" : "#eee",
    verified: user?.isVerified ? "#3B82F6" : "#9CA3AF",
  };

  const Row = ({ label, value }: { label: string; value: any }) => {
    let displayValue = "N/A";

    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        displayValue = value.length > 0 ? value.map((v) => (typeof v === "object" ? Object.values(v).filter(Boolean).join(" - ") : String(v))).join("; ") : "None";
      } else if (typeof value === "object") {
        displayValue = Object.values(value).filter(Boolean).join(", ") || "N/A";
      } else if (label.toLowerCase().includes("date") || String(value).includes("T")) {
        try {
          displayValue = new Date(value).toLocaleDateString();
        } catch {
          displayValue = "Invalid Date";
        }
      } else {
        displayValue = String(value);
      }
    }

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
          paddingBottom: 4,
        }}
      >
        <Text style={{ color: colors.label, fontSize: 14 }}>{label}</Text>
        <Text
          style={{
            color: colors.text,
            fontSize: 14,
            fontWeight: "600",
            flexShrink: 1,
            textAlign: "right",
          }}
        >
          {displayValue}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: colors.bg,
        padding: 16,
        borderRadius: 14,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          marginBottom: 12,
          color: colors.text,
        }}
      >
        Personal Information
      </Text>
      <Row label="Email" value={user.email} />
      <Row label="Phone" value={user.phone} />
      <Row label="Gender" value={user.gender} />
      <Row label="Date of Birth" value={user.dob} />
      <Row label="Blood Group" value={user.bloodGroup} />
      <Row label="Address" value={user.address} />
      <Row label="Anonymous" value={user.isAnonymous ? "Yes" : "No"} />
      <Row label="Role" value={user.role} />
    </View>
  );
}
// components/DoctorExtraInfo.tsx
import React from "react";
import { View, Text } from "react-native";

type Props = {
  doctor: any;
  isDark: boolean;
};

export default function DoctorExtraInfo({ doctor, isDark }: Props) {
  const colors = {
    bg: isDark ? "#1E1E1E" : "#fff",
    text: isDark ? "#fff" : "#000",
    label: isDark ? "#aaa" : "#555",
    border: isDark ? "#333" : "#eee",
  };

  const Row = ({ label, value }: { label: string; value: any }) => {
    let displayValue = "N/A";

    if (value !== null && value !== undefined) {
      if (typeof value === "object" && !Array.isArray(value)) {
        displayValue = Object.values(value).filter(Boolean).join(", ") || "N/A";
      } else if (Array.isArray(value)) {
        displayValue = value.length > 0 ? value.map((v) => (typeof v === "object" ? Object.values(v).filter(Boolean).join(" - ") : String(v))).join("; ") : "None";
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
        padding: 14,
        borderRadius: 12,
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
        Doctor Information
      </Text>
      <Row label="Specialty" value={doctor.specialty} />
      <Row label="License Number" value={doctor.licenseNumber} />
      <Row label="Clinic Name" value={doctor.clinicName} />
      <Row label="Years of Experience" value={doctor.experience} />
      <Row label="Consultation Fee" value={doctor.fee ? `$${doctor.fee}` : "N/A"} />
    </View>
  );
}
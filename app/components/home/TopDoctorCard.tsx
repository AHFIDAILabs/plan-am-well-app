import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Doctor } from '../../types/DoctorType'; 

// 🛠️ The interface is correct: it requires Doctor plus derived fields.
interface TopDoctorCardProps {
    doctor: Doctor; 
    onPress: (id: string) => void;
    distance: string; 
    rating: number; 
}

export const TopDoctorCard: React.FC<TopDoctorCardProps> = ({ 
  doctor, 
  onPress,
  distance,
  rating
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(doctor._id)} style={styles.doctorCard}> 
      <Image
        source={{ uri: doctor.avatar?.url || 'https://via.placeholder.com/60' }} //Use fallback
        style={styles.doctorImage}
      />
      <Text style={styles.doctorName}>{doctor.displayName}</Text> 
      <Text style={styles.doctorSpec}>{doctor.specialization}</Text>
      <Text style={styles.doctorDistance}>{distance}</Text> 
      <Text style={styles.doctorDistance}>Rating: {rating} ⭐</Text> 
        
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  doctorCard: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // NOTE: You need to update your data to use actual URIs or add them to MOCK_DOCTORS
  doctorImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 8 }, 
  doctorName: { fontWeight: "700", fontSize: 13, color: "#111" },
  doctorSpec: { fontSize: 12, color: "#555" },
  doctorDistance: { fontSize: 11, color: "#999", marginTop: 4 },
});
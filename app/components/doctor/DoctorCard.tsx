import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RatingStars } from '../doctor/RatingStars'; 
const { width } = Dimensions.get('window');

interface DoctorData {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  imageUri: string;
  isFavorite: boolean;
}

interface DoctorCardProps {
  doctor: DoctorData;
  onPress: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress, onToggleFavorite }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(doctor.id)}>
    <Image source={{ uri: doctor.imageUri }} style={styles.avatar} />
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{doctor.name}</Text>
      <Text style={styles.specialization}>{doctor.specialization}</Text>
      <RatingStars rating={doctor.rating} />
    </View>
    <TouchableOpacity onPress={() => onToggleFavorite(doctor.id)} style={styles.favoriteButton}>
      <Ionicons
        name={doctor.isFavorite ? 'heart' : 'heart-outline'}
        size={24}
        color={doctor.isFavorite ? '#ff4d4f' : '#ccc'}
      />
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242a38', // Dark background for contrast
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: width - 40, // Full width minus screen padding
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  specialization: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  favoriteButton: {
    padding: 5,
  },
});
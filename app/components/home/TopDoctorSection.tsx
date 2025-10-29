// components/home/TopDoctorSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { TopDoctorCard } from './TopDoctorCard';
import { Doctor } from '../../types/DoctorType'; // Assuming this path is correct

// 🛠️ FIX 1: Create an intersection type that includes the Doctor schema fields AND the derived display fields.
type ListDoctor = Doctor & {
    distance: string;
    rating: number;
}

interface TopDoctorSectionProps {
    // 🛠️ Use the ListDoctor type here
    doctors: ListDoctor[]; 
    onViewAll: () => void;
    onDoctorPress: (id: string) => void;
}

export const TopDoctorSection: React.FC<TopDoctorSectionProps> = ({ doctors, onViewAll, onDoctorPress }) => {
    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Doctor</Text>
                <TouchableOpacity onPress={onViewAll}>
                    <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={doctors}
                keyExtractor={(item) => item._id} 
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TopDoctorCard 
                        doctor={item} 
                        onPress={onDoctorPress} 
                        distance={item.distance} 
                        rating={item.rating} 
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  seeAll: { fontSize: 13, color: "#0077b6", fontWeight: "500" },
  listContent: { 
      paddingVertical: 6 
  }
});
import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, ScrollView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryPill } from '../../components/doctor/CategoryPill';
import { DoctorCard } from '../../components/doctor/DoctorCard';

// Mock Data Structure (replace with actual API data later)
const MOCK_CATEGORIES = ['All', 'Dentist', 'Cardiology', 'Physio Therapy', 'Ophthalmology', 'Pediatrics'];
const MOCK_DOCTORS = [
  { id: '1', name: 'Dr. Dexter Paul', specialization: 'Specialist Cardiologist', rating: 4.5, imageUri: 'https://i.pravatar.cc/100?img=1', isFavorite: true },
  { id: '2', name: 'Dr. Ether Wall', specialization: 'Specialist Cancer', rating: 3.9, imageUri: 'https://i.pravatar.cc/100?img=2', isFavorite: false },
  { id: '3', name: 'Dr. Jordan Smith', specialization: 'Specialist Dentist', rating: 4.8, imageUri: 'https://i.pravatar.cc/100?img=3', isFavorite: true },
  { id: '4', name: 'Dr. Johan Smith', specialization: 'General Practitioner', rating: 4.2, imageUri: 'https://i.pravatar.cc/100?img=4', isFavorite: false },
  // Add more doctors here...
];

export const FindDoctorScreen: React.FC = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState(MOCK_DOCTORS);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app: Filter MOCK_DOCTORS or trigger an API call here
  };

  const handleCardPress = (id: string) => {
    // Navigate to the details screen, passing the doctor ID
    navigation.navigate('DoctorDetails', { doctorId: id });
  };

  const handleToggleFavorite = (id: string) => {
    setDoctors(prev =>
      prev.map(doc =>
        doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Doctors</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      <View style={styles.contentContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctor"
            placeholderTextColor="#ccc"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {MOCK_CATEGORIES.map(category => (
            <CategoryPill
              key={category}
              label={category}
              isActive={activeCategory === category}
              onPress={() => setActiveCategory(category)}
            />
          ))}
        </ScrollView>

        {/* Doctor List */}
        <FlatList
          data={doctors.filter(doc => activeCategory === 'All' || doc.specialization.includes(activeCategory))}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DoctorCard
              doctor={item}
              onPress={handleCardPress}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1f2b', // Dark background color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242a38',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#fff',
  },
  categoryScroll: {
    paddingBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CategoryPillProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.pill, isActive ? styles.activePill : styles.inactivePill]}
    onPress={onPress}
  >
    <Text style={[styles.pillText, isActive ? styles.activeText : styles.inactiveText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    // Ensure the pill doesn't shrink in the horizontal list
    minWidth: 80, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    backgroundColor: '#00bbf9', // Main theme color
    borderColor: '#00bbf9',
  },
  inactivePill: {
    backgroundColor: 'transparent',
    borderColor: '#00bbf9',
  },
  pillText: {
    fontWeight: '600',
    fontSize: 14,
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: '#00bbf9',
  },
});
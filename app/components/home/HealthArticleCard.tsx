// components/home/HealthArticleCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ArticleCardData {
  id: string;
  title: string;
  category: string;
  iconName?: keyof typeof Ionicons.glyphMap; // This type is correct for Ionicons
}


interface HealthArticleCardProps {
  // Use the renamed, local type definition for this component's props
  article: ArticleCardData; 
  onPress: (id: string) => void;
}

export const HealthArticleCard: React.FC<HealthArticleCardProps> = ({ article, onPress }) => (
  <TouchableOpacity key={article.id} style={styles.articleCard} onPress={() => onPress(article.id)}>
    <View style={styles.articleIcon}>
      {/* Ensure the fallback icon name is cast as the generic string type (or removed, if you rely on the strong type) */}
      <Ionicons name={article.iconName || "newspaper-outline"} size={20} color="#3b82f6" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.articleTitle}>{article.title}</Text>
      <Text style={styles.articleCategory}>{article.category}</Text>
    </View>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  articleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  articleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  articleTitle: { fontSize: 14, fontWeight: "700", color: "#111" },
  articleCategory: { fontSize: 12, color: "#666" },
});
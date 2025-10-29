// components/home/HealthArticleSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HealthArticleCard, ArticleCardData } from './HealthArticleCard';



interface HealthArticleSectionProps {
  articles: ArticleCardData[];
  onViewAll: () => void;
  onArticlePress: (id: string) => void;
}

export const HealthArticleSection: React.FC<HealthArticleSectionProps> = ({ articles, onViewAll, onArticlePress }) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Health article</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {articles.map((item) => (
        <HealthArticleCard key={item.id} article={item} onPress={onArticlePress} />
      ))}
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
});
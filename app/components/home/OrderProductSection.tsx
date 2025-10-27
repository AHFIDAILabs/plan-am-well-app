import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// --- Types ---
interface ReproductiveProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string; 
  requiresPrescription: boolean; 
}

interface OrderProductSectionProps {
  product: ReproductiveProduct; 
  onOrder: (productId: string, quantity: number) => void;
  onViewAll: () => void; 
}

// Dummy products
const DUMMY_PRODUCTS: ReproductiveProduct[] = [
  {
    id: 'p1',
    name: 'Daily Contraception Pill (28 tabs)',
    price: 19.99,
    description: 'Monthly supply of oral contraceptive tablets for effective family planning.',
    imageUrl: 'https://i.ibb.co/L5hY82x/p1.png',
    requiresPrescription: true, 
  },
  {
    id: 'p2',
    name: 'Fertility Testing Kit',
    price: 49.50,
    description: 'At-home testing kit to track and predict ovulation windows.',
    imageUrl: 'https://i.ibb.co/30Xn59t/p2.png',
    requiresPrescription: false, 
  },
  {
    id: 'p3',
    name: 'Prenatal Vitamins (60 caps)',
    price: 32.00,
    description: 'Essential nutrients including folic acid for pre-conception health.',
    imageUrl: 'https://i.ibb.co/yqg64fT/p3.png',
    requiresPrescription: false, 
  },
];

// ===========================
// ⭐ Product Card
// ===========================
const OrderProductSection: React.FC<OrderProductSectionProps> = ({ product, onOrder, onViewAll }) => {
  const [quantity, setQuantity] = useState(1);
  const { id, name, price, description, imageUrl, requiresPrescription } = product;
  const isDisabled = requiresPrescription;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <LinearGradient colors={['#f9f9f9', '#eef2ff']} style={styles.card}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image} 
        resizeMode="cover" 
      />
      <View style={styles.content}>
        <Text style={styles.productName} numberOfLines={1}>{name}</Text>
        <Text style={styles.productPrice}>${(price * quantity).toFixed(2)}</Text>

        <View style={styles.detailsRow}>
          {requiresPrescription ? (
            <View style={styles.warningRow}>
              <Ionicons name="alert-circle-outline" size={14} color="#dc3545" />
              <Text style={styles.warningText}>Prescription Req.</Text>
            </View>
          ) : (
            <Text style={styles.noWarningText}>OTC Item</Text>
          )}
          <Text style={styles.descriptionText} numberOfLines={1}>{description}</Text>
        </View>

        <View style={styles.quantityAndButtonRow}>
          <View style={styles.quantityControl}>
            <TouchableOpacity onPress={() => handleQuantityChange(-1)} disabled={quantity <= 1 || isDisabled} style={[styles.qtyButton, (quantity <= 1 || isDisabled) && styles.qtyButtonDisabled]}>
              <Ionicons name="remove" size={20} color={(quantity <= 1 || isDisabled) ? '#aaa' : '#444'} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity onPress={() => handleQuantityChange(1)} disabled={isDisabled} style={[styles.qtyButton, isDisabled && styles.qtyButtonDisabled]}>
              <Ionicons name="add" size={20} color={isDisabled ? '#aaa' : '#444'} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => onOrder(id, quantity)} disabled={isDisabled} style={styles.btn}>
            <Text style={styles.btnText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

// ===========================
// ⭐ Slider Wrapper
// ===========================
interface ProductSliderProps {
  onOrder: (productId: string, quantity: number) => void;
  onViewAll: () => void;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ onOrder, onViewAll }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<any>(null);

  // Auto rotate every 5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % DUMMY_PRODUCTS.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended Item</Text>
        <TouchableOpacity onPress={onViewAll} style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>View all</Text>
          <Ionicons name="arrow-forward" size={14} color="#6366f1" />
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={DUMMY_PRODUCTS}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: width - 32,
          offset: (width - 32) * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={styles.slideItemWrapper}>
            <OrderProductSection product={item} onOrder={onOrder} onViewAll={onViewAll} />
          </View>
        )}
      />
    </View>
  );
};

// ===========================
// ⭐ Styles
// ===========================
const styles = StyleSheet.create({
  cardContainer: {
    paddingVertical: 10,
  },
  slideItemWrapper: {
    width: width - 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 12,
    width: '100%',
    shadowColor: '#6366f1',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: width * 0.4,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#eef2ff',
  },
  content: {
    flex: 1,
  },
  productName: {
    fontWeight: '800',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#dc3545',
    marginLeft: 4,
  },
  noWarningText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '700',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  descriptionText: {
    fontSize: 12,
    color: '#6b7280',
    flexShrink: 1,
  },
  quantityAndButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 2,
  },
  qtyButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  qtyButtonDisabled: {
    opacity: 0.5,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    color: '#1f2937',
  },
  btn: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 12,
    shadowColor: '#6366f1',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ProductSlider;

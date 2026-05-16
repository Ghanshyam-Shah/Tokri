// src/features/catalog/components/ProductCard.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Product } from '../types/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_GAP = 12;
const H_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - CARD_GAP) / 2;
const IMAGE_HEIGHT = CARD_WIDTH * 0.85;

const DARK = {
  bg: '#1c110b',
  surface: '#251913',
  surfaceHigh: '#2d1e16',
  border: '#3a2418',
  primary: '#f97316',
  textPrimary: '#f6ded3',
  textMuted: '#a78b7d',
};

interface ProductCardProps {
  product: Product;
  inList: boolean;
  onAddPress: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  inList,
  onAddPress,
}) => {
  return (
    <View style={styles.card}>
      {/* Image */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {product.isTopPick && (
          <View style={styles.topPickBadge}>
            <Text style={styles.topPickText}>TOP PICK</Text>
          </View>
        )}
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>

        <Text style={styles.productHindi} numberOfLines={1}>
          {product.nameHindi} • {product.unit}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>

          <TouchableOpacity
            onPress={() => onAddPress(product.id)}
            activeOpacity={0.85}
            style={[styles.addBtn, inList && styles.addBtnActive]}
          >
            <Icon name={inList ? 'check' : 'plus'} size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: DARK.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DARK.border,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },

  imageWrap: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: DARK.surfaceHigh,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  topPickBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: DARK.primary,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
  },

  topPickText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.8,
  },

  cardBody: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 3,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK.textPrimary,
    letterSpacing: 0.1,
  },

  productHindi: {
    fontSize: 12,
    color: DARK.textMuted,
    marginBottom: 6,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },

  price: {
    fontSize: 17,
    fontWeight: '700',
    color: DARK.textPrimary,
    letterSpacing: 0.2,
  },

  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: DARK.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addBtnActive: {
    backgroundColor: '#16a34a',
  },
});

export default ProductCard;

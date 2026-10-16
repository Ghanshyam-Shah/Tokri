// src/features/catalog/components/ProductCard.tsx
// Catalog-management card: image + naam + unit + Edit button.

import React, { useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';
import { Product } from '../types/types';
import { CARD_W, IMAGE_H } from '../constants/layout';

interface Props {
  product: Product;
  onEdit: (id: string) => void;
}

const ProductCard = ({ product, onEdit }: Props) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.card}>
      <View style={styles.imgWrap}>
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.img}
          resizeMode="cover"
        />
        {product.isTopPick && (
          <View style={styles.topPick}>
            <Text style={styles.topPickTxt}>TOP PICK</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.hindi} numberOfLines={1}>
          {product.nameHindi}
        </Text>

        <TouchableOpacity
          onPress={() => onEdit(product.id)}
          activeOpacity={0.85}
          style={styles.editBtn}
        >
          <Text style={styles.editBtnUnit}>{product.unit}</Text>

          <View style={styles.editBtnLeft}>
            <Icon name="pencil-outline" size={15} color={colors.primary} />
            <Text style={styles.editBtnTxt}>Edit</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } =
    theme;

  return StyleSheet.create({
    card: {
      width: CARD_W,
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },
    imgWrap: {
      width: '100%',
      height: IMAGE_H,
      backgroundColor: colors.cardBgVariant,
      overflow: 'hidden',
    },
    img: { width: '100%', height: '100%' },
    topPick: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
      borderBottomLeftRadius: borderRadius.md - 2,
    },
    topPickTxt: {
      fontSize: typography.xs - 2,
      fontFamily: fontFamilies.bold,
      color: colors.onPrimary,
      letterSpacing: 0.8,
    },
    body: {
      paddingHorizontal: spacing.sm + 2,
      paddingTop: 9,
      paddingBottom: spacing.sm + 2,
      gap: 2,
    },
    name: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      letterSpacing: 0.1,
    },
    hindi: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.hindi ?? fontFamilies.regular,
      color: colors.textMuted,
      marginBottom: spacing.sm,
    },
    editBtn: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.sm + 2,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md - 2,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.primaryMuted,
    },
    editBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    editBtnTxt: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.bold,
      color: colors.primary,
    },
    editBtnUnit: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.semiBold,
      color: colors.textMuted,
    },
  });
};

export default React.memo(ProductCard);
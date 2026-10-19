// src/shared/components/product/ProductCard.tsx
//
// Shared product card (catalog + create-list dono).
// Card sirf image / badges / naam / Hindi line dikhata hai.
// Neeche ka footer (Edit button, stepper, Add...) `children` se screen deti hai.
//
// Selection UI (optional):
//   selected    -> primary border + image par tick overlay
//   hasNote     -> image ke top-left me chhota note badge
//   onDeselect  -> tick dabane par call hota hai

import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';

// ─── Grid layout (screens bhi yahin se lete hain, taaki width sync rahe) ─────
export const GRID_H_PADDING = 16;
export const CARD_GAP = 12;
const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - GRID_H_PADDING * 2 - CARD_GAP) / 2;
const IMAGE_H = CARD_W * 0.82;

// Card ko jo minimum data chahiye (Catalog ka Product aur CreateList ka
// Product dono isse structurally match karte hain)
export interface ProductCardData {
  name: string;
  nameHindi: string;
  imageUrl?: string;
  isTopPick?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  /** Hindi line ki jagah kuch aur dikhana ho (default: product.nameHindi) */
  subtitle?: string;
  selected?: boolean;
  hasNote?: boolean;
  onDeselect?: () => void;
  /** Footer */
  children?: React.ReactNode;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  subtitle,
  selected = false,
  hasNote = false,
  onDeselect,
  children,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      {/* Image */}
      <View style={styles.imgWrap}>
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.img}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imgPlaceholder}>
            <Icon name="image-off-outline" size={32} color={colors.textMuted} />
          </View>
        )}

        {hasNote && (
          <View style={styles.noteBadge}>
            <Icon name="note-text-outline" size={12} color={colors.onDark} />
          </View>
        )}

        {product.isTopPick && (
          <View style={styles.topPick}>
            <Text style={styles.topPickTxt}>TOP PICK</Text>
          </View>
        )}

        {selected && (
          // tick dabane par item seedha remove
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={0.8}
            onPress={onDeselect}
          >
            <Icon name="check-circle" size={30} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.hindi} numberOfLines={1}>
          {subtitle ?? product.nameHindi}
        </Text>

        {children}
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

      // ── Border styling: dono variants rakhe hain, ek hi active rakho ──
      // A) Hamesha dikhne wala border (Catalog style). Dark theme me card
      //    background se alag dikhta hai. Selected hone par sirf rang badalta
      //    hai (width same, isliye grid reflow nahi hota).
      borderWidth: 1,
      borderColor: colors.border,
      // B) Transparent 1.5 border (CreateList style). Border sirf selected
      //    hone par dikhta hai. A ki do lines hata ke ye do lines on karo.
      // borderWidth: 1.5,
      // borderColor: 'transparent',

      ...shadows.sm,
    },
    cardSelected: { borderColor: colors.primary },
    imgWrap: {
      width: '100%',
      height: IMAGE_H,
      backgroundColor: colors.cardBgVariant,
      overflow: 'hidden',
    },

    img: { width: '100%', height: '100%' },
    imgPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    noteBadge: {
      position: 'absolute',
      top: 6,
      left: 6,
      width: 22,
      height: 22,
      borderRadius: 7,
      backgroundColor: colors.photoBadgeBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
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
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.photoScrim,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      paddingHorizontal: spacing.sm + 2,
      paddingTop: 9,
      paddingBottom: spacing.sm + 2,
      gap: 3,
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
      marginBottom: 6,
    },
  });
};

export default React.memo(ProductCard);
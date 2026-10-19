import React, { useState, useCallback, useMemo, } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CATEGORIES, PRODUCTS } from '../../../Data/DummyData';
import { Product } from '../../../Data/types'
import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppStackParamList } from '../../../navigation/types/navigationTypes';
import CollapsibleFilterBar from '../../../shared/components/filterBar/CollapsibleFilterBar';
import { useCollapsibleBar } from '../../../shared/hooks/useCollapsibleBar';
import EmptyState from '../../../shared/components/states/EmptyState';

type Theme = ReturnType<typeof useTheme>['theme'];

// ─── Layout constants (theme se independent) ──────────────────────────────────
const H_PADDING = 16;
const { width: SCREEN_W } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_W = (SCREEN_W - H_PADDING * 2 - CARD_GAP) / 2;
const IMAGE_H = CARD_W * 0.82;

// ═══════════════════════════════════════════════════════════════════
// Product Card — catalog-management version (Edit button + unit)
// ═══════════════════════════════════════════════════════════════════
const ProductCard = React.memo(
  ({ product, onEdit }: { product: Product; onEdit: (id: string) => void }) => {
    const { theme } = useTheme();
    const { colors } = theme;
    const pc = useMemo(() => createCardStyles(theme), [theme]);

    return (
      <View style={pc.card}>
        <View style={pc.imgWrap}>
          <Image
            source={{ uri: product.imageUrl }}
            style={pc.img}
            resizeMode="cover"
          />
          {product.isTopPick && (
            <View style={pc.topPick}>
              <Text style={pc.topPickTxt}>TOP PICK</Text>
            </View>
          )}
        </View>

        <View style={pc.body}>
          <Text style={pc.name} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={pc.hindi} numberOfLines={1}>
            {product.nameHindi}
          </Text>

          <TouchableOpacity
            onPress={() => onEdit(product.id)}
            activeOpacity={0.85}
            style={pc.editBtn}
          >
            <Text style={pc.editBtnUnit}>{product.unit}</Text>

            <View style={pc.editBtnLeft}>
              <Icon name="pencil-outline" size={15} color={colors.primary} />
              <Text style={pc.editBtnTxt}>Edit</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const createCardStyles = (theme: Theme) => {
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
      backgroundColor: colors.primaryMuted, // primary 6-digit hex hona chahiye
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

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════
const CatalogScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const { theme } = useTheme();
  const { colors } = theme;
  const s = useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter(p => {
      const catOk =
        selectedCategory === 'all' || p.categoryId === selectedCategory;
      const srchOk =
        p.name.toLowerCase().includes(q) || p.nameHindi.includes(q);
      return catOk && srchOk;
    });
  }, [selectedCategory, searchQuery]);
  const { barHeight, barTranslateY, onBarLayout, handleScroll } =
    useCollapsibleBar();

  // header "+" → AddItem screen
  const handleAddProduct = useCallback(() => {
    navigation.navigate('AddItem');
  }, [navigation]);

  // card "Edit" → EditItem screen
  const handleEditProduct = useCallback(
    (id: string) => {
      navigation.navigate('EditItem', { productId: id });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onEdit={handleEditProduct} />
    ),
    [handleEditProduct],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  // ═══ collapsible search + chips bar ═══


  return (
    <View style={s.root}>
      <SafeAreaView style={s.safeArea} edges={['top']}>
        {/* ═════════════════════════════ App Header ═════════════════════════════ */}
        <AppHeader
          title="Catalog"
          showThemeToggle={false}
          rightIcon="plus-circle-outline"
          onRightPress={handleAddProduct}
        />

        {/* ── Body: collapsible search/chips overlay + product grid ── */}
        <View style={s.body}>
          <CollapsibleFilterBar
            translateY={barTranslateY}
            onLayout={onBarLayout}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search catalog / सूची खोजें..."
            chips={CATEGORIES}
            selectedChipId={selectedCategory}
            onSelectChip={setSelectedCategory}
          />

          <FlatList
            data={filteredProducts}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ gap: CARD_GAP }}
            contentContainerStyle={[
              s.gridContent,
              { paddingTop: barHeight, paddingBottom: 24 },
            ]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <EmptyState
                icon="basket-off-outline"
                title="Koi product nahi mila"
                subtitle="Try another search or category"
              />
            } removeClippedSubviews
            maxToRenderPerBatch={6}
            windowSize={10}
            initialNumToRender={6}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

// ─── Styles (theme se) ────────────────────────────────────────────
const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.appBackground },
    safeArea: { flex: 1, backgroundColor: colors.appBackground },
    body: { flex: 1 },

    gridContent: { paddingHorizontal: H_PADDING, gap: CARD_GAP },
  });
};

export default CatalogScreen;
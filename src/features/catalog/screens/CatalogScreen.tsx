// src/features/catalog/screens/CatalogScreen.tsx
//
// CATALOG MANAGEMENT SCREEN — shopping-list builder (CreateListScreen) nahi hai.
// Yahan shop owner apna product catalog manage karta hai: naya product add,
// existing product edit.
//
// Header: shared AppHeader (menu + title + "+")
// StatusBar: App.tsx se control hota hai, yahan nahi.
// Colors/fonts/spacing: sab useTheme() se.

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Product } from '../types/types';
import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppStackParamList } from '../../../navigation/types/navigationTypes';

type Theme = ReturnType<typeof useTheme>['theme'];

// ─── Layout constants (theme se independent) ──────────────────────────────────
const H_PADDING = 16;
const { width: SCREEN_W } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_W = (SCREEN_W - H_PADDING * 2 - CARD_GAP) / 2;
const IMAGE_H = CARD_W * 0.82;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  label: string;
  labelHindi: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', labelHindi: 'सभी' },
  { id: 'vegetables', label: 'Vegetables', labelHindi: 'सब्जियां' },
  { id: 'dairy', label: 'Dairy', labelHindi: 'डेयरी' },
  { id: 'grains', label: 'Grains', labelHindi: 'अनाज' },
  { id: 'spices', label: 'Spices', labelHindi: 'मसाले' },
  { id: 'snacks', label: 'Snacks', labelHindi: 'स्नैक्स' },
];

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    nameHindi: 'ताजा टमाटर',
    price: 40,
    unit: '1kg',
    categoryId: 'vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1546094096-0df4bcabd777?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Organic Milk',
    nameHindi: 'जैविक दूध',
    price: 68,
    unit: '1L',
    categoryId: 'dairy',
    imageUrl:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: 'Basmati Rice',
    nameHindi: 'बासमती चावल',
    price: 450,
    unit: '5kg',
    categoryId: 'grains',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '4',
    name: 'Toor Dal',
    nameHindi: 'अरहर दाल',
    price: 120,
    unit: '1kg',
    categoryId: 'grains',
    imageUrl:
      'https://images.unsplash.com/photo-1599909631565-9921aaabb4a7?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
  {
    id: '5',
    name: 'Yellow Bell Pepper',
    nameHindi: 'पीली शिमला मिर्च',
    price: 45,
    unit: '250g',
    categoryId: 'vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '6',
    name: 'Penne Pasta',
    nameHindi: 'पास्ता',
    price: 95,
    unit: '500g',
    categoryId: 'snacks',
    imageUrl:
      'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
  {
    id: '7',
    name: 'Fresh Paneer',
    nameHindi: 'ताजा पनीर',
    price: 85,
    unit: '200g',
    categoryId: 'dairy',
    imageUrl:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    isTopPick: true,
    createdAt: Date.now(),
  },
  {
    id: '8',
    name: 'Carrots',
    nameHindi: 'गाजर',
    price: 35,
    unit: '500g',
    categoryId: 'vegetables',
    imageUrl:
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
    isTopPick: false,
    createdAt: Date.now(),
  },
];

// ═══════════════════════════════════════════════════════════════════
// Category Chips
// ═══════════════════════════════════════════════════════════════════
const CategoryChips = React.memo(
  ({
    categories,
    selected,
    onSelect,
  }: {
    categories: Category[];
    selected: string;
    onSelect: (id: string) => void;
  }) => {
    const { theme } = useTheme();
    const { colors, spacing, borderRadius, typography, fontFamilies } = theme;

    const ch = useMemo(
      () =>
        StyleSheet.create({
          scrollStyle: { flexGrow: 0, flexShrink: 0 },
          row: {
            flexDirection: 'row',
            gap: spacing.sm,
            paddingHorizontal: H_PADDING,
            paddingVertical: spacing.xs,
          },
          chip: {
            flexShrink: 0,
            paddingHorizontal: spacing.md + 2,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.full,
            borderWidth: 1,
          },
          active: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          },
          inactive: { borderColor: colors.border },
          text: {
            fontSize: typography.xs + 1,
            fontFamily: fontFamilies.medium,
          },
        }),
      [colors, spacing, borderRadius, typography, fontFamilies],
    );

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={ch.row}
        style={ch.scrollStyle}
      >
        {categories.map(cat => {
          const active = selected === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelect(cat.id)}
              activeOpacity={0.8}
              style={[ch.chip, active ? ch.active : ch.inactive]}
            >
              <Text
                style={[
                  ch.text,
                  { color: active ? colors.appBackground : colors.textMuted },
                ]}
                numberOfLines={1}
              >
                {cat.label} / {cat.labelHindi}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  },
);

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
      color: colors.appBackground,
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
      backgroundColor: `${colors.primary}26`, // primary 6-digit hex hona chahiye
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

// ─── Empty state ──────────────────────────────────────────────────
const EmptyList = React.memo(() => {
  const { theme } = useTheme();
  const { colors, spacing, typography, fontFamilies } = theme;

  const e = useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          alignItems: 'center',
          paddingVertical: spacing.giant,
          gap: spacing.sm + 2,
        },
        title: {
          color: colors.textPrimary,
          fontSize: typography.md,
          fontFamily: fontFamilies.semiBold,
        },
        sub: {
          color: colors.textMuted,
          fontSize: typography.xs + 1,
          fontFamily: fontFamilies.regular,
        },
      }),
    [colors, spacing, typography, fontFamilies],
  );

  return (
    <View style={e.wrap}>
      <Icon name="basket-off-outline" size={52} color={colors.textMuted} />
      <Text style={e.title}>Koi product nahi mila</Text>
      <Text style={e.sub}>Try another search or category</Text>
    </View>
  );
});

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
  const [barHeight, setBarHeight] = useState(116);
  const barTranslateY = useRef(new Animated.Value(0)).current;
  const barHidden = useRef(false);
  const lastOffset = useRef(0);

  const showBar = useCallback(() => {
    if (!barHidden.current) return;
    barHidden.current = false;
    Animated.timing(barTranslateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [barTranslateY]);

  const hideBar = useCallback(() => {
    if (barHidden.current) return;
    barHidden.current = true;
    Animated.timing(barTranslateY, {
      toValue: -barHeight,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [barTranslateY, barHeight]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const diff = y - lastOffset.current;

      if (y <= 4) {
        showBar();
      } else if (diff > 2 && y > barHeight) {
        hideBar();
      } else if (diff < -2) {
        showBar();
      }

      lastOffset.current = y;
    },
    [barHeight, showBar, hideBar],
  );

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
          <Animated.View
            onLayout={e => setBarHeight(e.nativeEvent.layout.height)}
            style={[
              s.collapsibleBar,
              { transform: [{ translateY: barTranslateY }] },
            ]}
          >
            <View style={s.searchWrap}>
              <Icon
                name="magnify"
                size={20}
                color={colors.textMuted}
                style={s.searchIcon}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search catalog / सूची खोजें..."
                placeholderTextColor={colors.textMuted}
                style={s.searchInput}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.75}
                >
                  <Icon
                    name="close-circle"
                    size={18}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              )}
            </View>

            <CategoryChips
              categories={CATEGORIES}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </Animated.View>

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
            ListEmptyComponent={<EmptyList />}
            removeClippedSubviews
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

    collapsibleBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: colors.appBackground,
      paddingBottom: spacing.sm,
    },

    searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: H_PADDING,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
      backgroundColor: colors.cardBgVariant,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      height: 44,
    },
    searchIcon: { marginRight: spacing.sm },
    searchInput: {
      flex: 1,
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textPrimary,
      paddingVertical: 0,
    },

    gridContent: { paddingHorizontal: H_PADDING, gap: CARD_GAP },
  });
};

export default CatalogScreen;
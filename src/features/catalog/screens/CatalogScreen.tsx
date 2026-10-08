// src/features/catalog/screens/CatalogScreen.tsx
//
// CATALOG MANAGEMENT SCREEN — this is NOT the shopping-list builder
// (CreateListScreen). This screen is where the shop owner manages their
// own product catalog: add a new product, edit an existing one, (remove
// will live inside EditItem later). There is no "select items into a
// list" concept here, so there's no card-selection state, no cart/receipt
// icon, and no bottom Continue/Save/Share bar.
//
// Visual system (theme, header layout, search bar, category chips,
// collapsible-on-scroll behaviour, card shell styling) is ported 1:1 from
// CreateListScreen so both screens look and feel identical. Because of
// that, this file is self-contained just like CreateListScreen — it no
// longer imports the separate CatalogHeader / SearchBar / CategoryChips /
// ProductCard component files. Those files still exist and are untouched;
// this screen just doesn't use them anymore. Delete or repurpose them
// whenever you're ready — not touching them here since that wasn't asked.
//
// ⚠️ Both nav targets below are stubs — AddItem.tsx and EditItem.tsx don't
// exist yet, so navigation.navigate(...) is cast `as never` to keep TS
// happy until those routes are added to your stack's param list.

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  Dimensions,
  ScrollView,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Product } from '../types/types';
// import { Product } from '../catalog/types/types';

// import { Product } from '../types/types';

// ═══════════════════════════════════════════════════════════════════
// THEME SYSTEM — identical block to CreateListScreen. Swap ACTIVE_THEME
// to preview each palette; keep this in sync with CreateListScreen /
// List.tsx by hand until you extract it into a shared theme file.
// ═══════════════════════════════════════════════════════════════════
const THEMES = {
  ember: {
    bg: '#ffffff',
    surface: 'white',
    surfaceHigh: '#2d1e16',
    border: '#3a2418',
    primary: 'skyblue',
    primaryMuted: '#2d1800',
    textPrimary: 'black',
    textMuted: 'black',
    chipBorder: '#584237',
    searchBg: '#1e1208',
    green: '#16a34a',
    red: '#dc2626',
    accent: '#fb923c',
  },
  skySlate: {
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceHigh: '#F0F6FA',
    border: '#DCE7EE',
    primary: 'skyblue',
    primaryMuted: '#EAF4FA',
    textPrimary: '#263640',
    textMuted: '#71818C',
    chipBorder: '#D5E2E9',
    searchBg: '#F3F7F9',
    green: '#5FA77A',
    red: '#D97878',
    accent: '#8AA7B8',
  },
} as const;

const ACTIVE_THEME: keyof typeof THEMES = 'skySlate';
const DARK = THEMES[ACTIVE_THEME];

const H_PADDING = 16;
const { width: SCREEN_W } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_W = (SCREEN_W - H_PADDING * 2 - CARD_GAP) / 2;
const IMAGE_H = CARD_W * 0.82;
const HEADER_H = Platform.OS === 'ios' ? 52 : 52;

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
// Category Chips — same shrink-fix as CreateListScreen
// (flexShrink:0 on the ScrollView + the chip, numberOfLines on the text)
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
  }) => (
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
              style={[ch.text, { color: active ? '#fff' : DARK.textMuted }]}
              numberOfLines={1}
            >
              {cat.label} / {cat.labelHindi}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  ),
);
const ch = StyleSheet.create({
  scrollStyle: { flexGrow: 0, flexShrink: 0 },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: H_PADDING,
    paddingVertical: 4,
  },
  chip: {
    flexShrink: 0,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  active: { backgroundColor: DARK.primary, borderColor: DARK.primary },
  inactive: { borderColor: DARK.chipBorder },
  text: { fontSize: 13, fontWeight: '500' },
});

// ═══════════════════════════════════════════════════════════════════
// Product Card — catalog-management version:
//   • no selection state, no add/tick overlay (nothing to "select" here)
//   • bottom is a single full-width Edit button, and the button itself
//     shows the product's default quantity/unit (e.g. "1kg", "500g")
//     on its right side, per point 5.
// ═══════════════════════════════════════════════════════════════════
const ProductCard = React.memo(
  ({ product, onEdit }: { product: Product; onEdit: (id: string) => void }) => (
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
        {/* <Text style={pc.price}>₹{product.price.toFixed(2)}</Text> */}

        <TouchableOpacity
          onPress={() => onEdit(product.id)}
          activeOpacity={0.85}
          style={pc.editBtn}
        >
          <Text style={pc.editBtnUnit}>{product.unit}</Text>

          <View style={pc.editBtnLeft}>
            <Icon name="pencil-outline" size={15} color={DARK.primary} />
            <Text style={pc.editBtnTxt}>Edit</Text>
          </View>
          {/* <Text style={pc.editBtnUnit}>{product.unit}</Text> */}
        </TouchableOpacity>
      </View>
    </View>
  ),
);

const pc = StyleSheet.create({
  card: {
    width: CARD_W,
    backgroundColor: DARK.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: DARK.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 2,
  },
  imgWrap: {
    width: '100%',
    height: IMAGE_H,
    backgroundColor: DARK.surfaceHigh,
    overflow: 'hidden',
  },
  img: { width: '100%', height: '100%' },
  topPick: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: DARK.primary,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
  },
  topPickTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.8,
  },
  body: { paddingHorizontal: 10, paddingTop: 9, paddingBottom: 10, gap: 2 },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: DARK.textPrimary,
    letterSpacing: 0.1,
  },
  hindi: { fontSize: 11, color: DARK.textMuted, marginBottom: 8 },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK.textPrimary,
    marginTop: 2,
    marginBottom: 8,
  },
  editBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DARK.chipBorder,
    backgroundColor: DARK.primaryMuted,
  },
  editBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  editBtnTxt: { fontSize: 12, fontWeight: '700', color: DARK.primary },
  editBtnUnit: { fontSize: 12, fontWeight: '600', color: DARK.textMuted },
});

// ─── Empty state ──────────────────────────────────────────────────
const EmptyList = React.memo(() => (
  <View style={{ alignItems: 'center', paddingVertical: 64, gap: 10 }}>
    <Icon name="basket-off-outline" size={52} color={DARK.textMuted} />
    <Text style={{ color: DARK.textPrimary, fontSize: 16, fontWeight: '600' }}>
      Koi product nahi mila
    </Text>
    <Text style={{ color: DARK.textMuted, fontSize: 13 }}>
      Try another search or category
    </Text>
  </View>
));

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════
const CatalogScreen: React.FC = () => {
  const navigation = useNavigation();

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

  const handleMenu = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  // point 3: header "+" opens AddItem.tsx (not designed yet)
  const handleAddProduct = useCallback(() => {
    // TODO: AddItem screen not built yet — wire this up once it exists
    (navigation as any).navigate('AddItem');
  }, [navigation]);

  // point 4: card "Edit" opens EditItem.tsx (not designed yet)
  const handleEditProduct = useCallback(
    (id: string) => {
      // TODO: EditItem screen not built yet — wire this up once it exists
      (navigation as any).navigate('EditItem', { productId: id });
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

  // ═══ collapsible search + chips bar — same behaviour as CreateListScreen ═══
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
      <StatusBar barStyle="dark-content" backgroundColor={DARK.bg} />

      <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
        {/* ── Header: menu (left) + title + add-product (right) ── */}
        <View style={s.header}>
          <TouchableOpacity
            onPress={handleMenu}
            activeOpacity={0.75}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={s.iconBtn}
          >
            <Icon name="menu" size={24} color={DARK.textPrimary} />
          </TouchableOpacity>

          <View style={s.headerCenter}>
            <Text style={s.headerTitle} numberOfLines={1}>
              Catalog
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleAddProduct}
            activeOpacity={0.75}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={s.iconBtn}
          >
            <Icon
              name="plus-circle-outline"
              size={24}
              color={DARK.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* ── Body: collapsible search/chips overlay + product grid ── */}
        <View style={{ flex: 1 }}>
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
                color={DARK.textMuted}
                style={{ marginRight: 8 }}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search catalog / सूची खोजें..."
                placeholderTextColor={DARK.textMuted}
                style={s.searchInput}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.75}
                >
                  <Icon name="close-circle" size={18} color={DARK.textMuted} />
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

// ─── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: DARK.bg },
  safeArea: { flex: 1, backgroundColor: DARK.bg },

  header: {
    height: HEADER_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DARK.border,
    zIndex: 20,
    backgroundColor: DARK.bg,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK.textPrimary,
    letterSpacing: 0.2,
  },

  collapsibleBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: DARK.bg,
    paddingBottom: 8,
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: H_PADDING,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: DARK.searchBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DARK.border,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: DARK.textPrimary,
    paddingVertical: 0,
  },

  gridContent: { paddingHorizontal: H_PADDING, gap: CARD_GAP },
});

export default CatalogScreen;

// src/features/catalog/screens/CatalogScreen.tsx

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ProductCard from '../components/ProductCard';
import { Product } from '../types/types';

import CatalogHeader from '../components/CatalogHeader';
import SearchBar from '../../../shared/components/searchBar/SearchBar';
import CategoryChips from '../components/CategoryChips';

interface Category {
  id: string;
  label: string;
  labelHindi: string;
}

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

const DARK = {
  bg: '#1c110b',
  border: '#3a2418',
  primary: '#f97316',
  textPrimary: '#f6ded3',
  textMuted: '#a78b7d',
  chipBorder: '#584237',
  searchBg: '#1e1208',
};

const H_PADDING = 16;

const EmptyList = React.memo(() => (
  <View style={styles.emptyState}>
    <Icon name="basket-off-outline" size={52} color={DARK.textMuted} />

    <Text style={styles.emptyText}>Koi product nahi mila</Text>

    <Text style={styles.emptySubText}>Try another search or category</Text>
  </View>
));

const CatalogScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [searchQuery, setSearchQuery] = useState('');

  const [listIds, setListIds] = useState<string[]>([]);

  // ─── Optimized filtering ─────────────────────

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return PRODUCTS.filter(product => {
      const categoryMatch =
        selectedCategory === 'all' || product.categoryId === selectedCategory;

      const searchMatch =
        product.name.toLowerCase().includes(q) || product.nameHindi.includes(q);

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchQuery]);

  // ─── Cart Toggle ─────────────────────────────

  const toggleCart = useCallback((id: string) => {
    setListIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  }, []);

  // ─── Render Product Item ─────────────────────

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        inList={listIds.includes(item.id)}
        onAddPress={toggleCart}
      />
    ),
    [listIds, toggleCart],
  );

  // ─── Key Extractor ───────────────────────────
  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={DARK.bg} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <CatalogHeader title="Catalog" />

        {/* Search */}
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {/* Categories */}
        <CategoryChips
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Product Grid */}
        <View style={styles.listWrapper}>
          <FlatList
            data={filteredProducts}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContent}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<EmptyList />}
            removeClippedSubviews={true}
            maxToRenderPerBatch={6}
            windowSize={10}
            initialNumToRender={6}
          />
        </View>

        {/* FAB */}
        {listIds.length > 0 && (
          <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
            <Icon name="cart-outline" size={26} color="#fff" />

            <View style={styles.fabBadge}>
              <Text style={styles.fabBadgeText}>{listIds.length}</Text>
            </View>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DARK.bg,
  },

  safeArea: {
    flex: 1,
    backgroundColor: DARK.bg,
  },

  listWrapper: {
    flex: 1,
  },

  gridContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 100,
    gap: 12,
  },

  row: {
    // justifyContent: 'space-between',
    // marginBottom: 12,
    gap: 12,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 10,
  },

  emptyText: {
    color: DARK.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  emptySubText: {
    color: DARK.textMuted,
    fontSize: 13,
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: DARK.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fabBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: DARK.primary,
  },
});

export default CatalogScreen;

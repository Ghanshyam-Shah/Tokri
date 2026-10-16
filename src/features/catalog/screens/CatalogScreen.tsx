// src/features/catalog/screens/CatalogScreen.tsx
//
// CATALOG MANAGEMENT SCREEN — shop owner apna product catalog manage karta hai
// (naya product add / existing edit). Shopping-list builder nahi hai.
//
// Sirf jodne ka kaam: data + hooks + components. UI ke tukde components/ me,
// logic hooks/ me. StatusBar App.tsx se control hota hai.

import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';
import { AppStackParamList } from '../../../navigation/types/navigationTypes';

import { Product } from '../types/types';
import { CATEGORIES, PRODUCTS } from '../data/catalogData';
import { CARD_GAP, H_PADDING } from '../constants/layout';
import { useCollapsibleBar } from '../hooks/useCollapsibleBar';
import { useProductFilter } from '../hooks/useProductFilter';
import { CatalogFilterBar, EmptyCatalog, ProductCard } from '../components';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const CatalogScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
  } = useProductFilter(PRODUCTS);

  const { barHeight, barTranslateY, onBarLayout, handleScroll } =
    useCollapsibleBar();

  // header "+" → AddItem
  const handleAddProduct = useCallback(() => {
    navigation.navigate('AddItem');
  }, [navigation]);

  // card "Edit" → EditItem
  const handleEditProduct = useCallback(
    (id: string) => navigation.navigate('EditItem', { productId: id }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onEdit={handleEditProduct} />
    ),
    [handleEditProduct],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AppHeader
          title="Catalog"
          showThemeToggle={false}
          rightIcon="plus-circle-outline"
          onRightPress={handleAddProduct}
        />

        <View style={styles.body}>
          <CatalogFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            translateY={barTranslateY}
            onLayout={onBarLayout}
          />

          <FlatList
            data={filteredProducts}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ gap: CARD_GAP }}
            contentContainerStyle={[
              styles.gridContent,
              { paddingTop: barHeight, paddingBottom: 24 },
            ]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<EmptyCatalog />}
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

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.appBackground },
    safeArea: { flex: 1, backgroundColor: theme.colors.appBackground },
    body: { flex: 1 },
    gridContent: { paddingHorizontal: H_PADDING, gap: CARD_GAP },
  });

export default CatalogScreen;
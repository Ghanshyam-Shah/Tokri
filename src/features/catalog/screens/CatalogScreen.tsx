import React, { useState, useCallback, useMemo, } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,

} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Product } from '../../../Data/types';
import { useCatalog } from '../hooks/useCatalog';
import CatalogListEmpty from '../components/CatalogListEmpty';
import AppHeader from '../../../shared/components/headers/AppHeader';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppStackParamList } from '../../../navigation/types/navigationTypes';
import CollapsibleFilterBar from '../../../shared/components/filterBar/CollapsibleFilterBar';
import { useCollapsibleBar } from '../../../shared/hooks/useCollapsibleBar';
import ProductCard, {
  CARD_GAP,
  GRID_H_PADDING,
} from '../../../shared/components/product/ProductCard';

type Theme = ReturnType<typeof useTheme>['theme'];

// ═══════════════════════════════════════════════════════════════════
// Catalog card = shared ProductCard + Edit footer
// ═══════════════════════════════════════════════════════════════════
const CatalogProductCard = React.memo(
  ({ product, onEdit }: { product: Product; onEdit: (id: string) => void }) => {
    const { theme } = useTheme();
    const { colors } = theme;
    const st = useMemo(() => createCardStyles(theme), [theme]);

    return (
      <ProductCard product={product}>
        <TouchableOpacity
          onPress={() => onEdit(product.id)}
          activeOpacity={0.85}
          style={st.editBtn}
        >
          <Text style={st.editBtnUnit}>{product.unit}</Text>

          <View style={st.editBtnLeft}>
            <Icon name="pencil-outline" size={15} color={colors.primary} />
            <Text style={st.editBtnTxt}>Edit</Text>
          </View>
        </TouchableOpacity>
      </ProductCard>
    );
  },
);

const createCardStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;

  return StyleSheet.create({
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

// ═══════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════
const CatalogScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const { theme } = useTheme();
  const { colors } = theme;
  const s = useMemo(() => createStyles(theme), [theme]);

  // Catalog Supabase se (default + user ke badlav)
  const { products, categories, loading, error, refresh } = useCatalog();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter(p => {
      const catOk =
        selectedCategory === 'all' || p.categoryId === selectedCategory;
      const srchOk =
        p.name.toLowerCase().includes(q) || p.nameHindi.includes(q);
      return catOk && srchOk;
    });
  }, [products, selectedCategory, searchQuery]);
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
      <CatalogProductCard product={item} onEdit={handleEditProduct} />),
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
            chips={categories}
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
            refreshing={loading && products.length > 0}
            onRefresh={refresh}
            progressViewOffset={barHeight}
            ListEmptyComponent={
              <CatalogListEmpty
                loading={loading && products.length === 0}
                error={error}
              />
            }
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
  const { colors, spacing, } = theme;

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.appBackground },
    safeArea: { flex: 1, backgroundColor: colors.appBackground },
    body: { flex: 1 },
gridContent: { paddingHorizontal: GRID_H_PADDING, gap: CARD_GAP },
  });
};

export default CatalogScreen;

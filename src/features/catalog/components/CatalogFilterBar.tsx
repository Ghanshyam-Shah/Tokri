// src/features/catalog/components/CatalogFilterBar.tsx
//
// Search + category chips ka absolute overlay. Scroll par translateY se
// chhupta hai (useCollapsibleBar). List ko isi bar ki height jitna paddingTop do.

import React, { useMemo } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet } from 'react-native';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';
import { Category } from '../data/catalogData';
import CatalogSearchBar from './CatalogSearchBar';
import CategoryChips from './CategoryChips';

interface Props {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  translateY: Animated.Value;
  onLayout: (e: LayoutChangeEvent) => void;
}

const CatalogFilterBar = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  translateY,
  onLayout,
}: Props) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Animated.View
      onLayout={onLayout}
      style={[styles.bar, { transform: [{ translateY }] }]}
    >
      <CatalogSearchBar value={searchQuery} onChangeText={onSearchChange} />
      <CategoryChips
        categories={categories}
        selected={selectedCategory}
        onSelect={onSelectCategory}
      />
    </Animated.View>
  );
};

const createStyles = (theme: AppTheme) => {
  const { colors, spacing } = theme;

  return StyleSheet.create({
    bar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: colors.appBackground,
      paddingBottom: spacing.sm,
    },
  });
};

export default CatalogFilterBar;
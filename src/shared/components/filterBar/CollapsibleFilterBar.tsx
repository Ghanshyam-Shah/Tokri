// src/shared/components/filterBar/CollapsibleFilterBar.tsx
//
// SearchBar + ChipRow ka absolute overlay.
// translateY aur onLayout `useCollapsibleBar` hook se aate hain.
// Absolute hone ki wajah se hide hone par gap nahi bachta; FlatList ka
// paddingTop (= barHeight) neeche jagah reserve karta hai.

import React, { useMemo } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet } from 'react-native';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';
import SearchBar from '../searchBar/SearchBar';
import ChipRow, { ChipItem } from '../chips/ChipRow';

const H_PADDING = 16;

interface CollapsibleFilterBarProps {
  translateY: Animated.Value;
  onLayout: (e: LayoutChangeEvent) => void;

  searchValue: string;
  onSearchChange: (text: string) => void;
  searchPlaceholder?: string;

  chips: ChipItem[];
  selectedChipId: string;
  onSelectChip: (id: string) => void;
}

const CollapsibleFilterBar: React.FC<CollapsibleFilterBarProps> = ({
  translateY,
  onLayout,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  chips,
  selectedChipId,
  onSelectChip,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Animated.View
      onLayout={onLayout}
      style={[styles.bar, { transform: [{ translateY }] }]}
    >
      <SearchBar
        value={searchValue}
        onChangeText={onSearchChange}
        placeholder={searchPlaceholder}
        containerStyle={styles.search}
      />

      <ChipRow
        items={chips}
        selectedId={selectedChipId}
        onSelect={onSelectChip}
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
    search: {
      marginHorizontal: H_PADDING,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
  });
};

export default React.memo(CollapsibleFilterBar);
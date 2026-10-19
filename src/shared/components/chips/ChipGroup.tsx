// src/shared/components/chips/ChipGroup.tsx
//
// Wrapped (multi-line) single-select chips. Forms ke andar use karo.
// Horizontal scroll wali row ke liye ChipRow use karo.

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';
import Chip, { ChipVariant } from './Chip';
import { ChipItem, formatLabel } from './ChipRow';

interface ChipGroupProps {
  items: ChipItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  variant?: ChipVariant;
  /** true -> "English / हिंदी", false (default) -> sirf English */
  bilingual?: boolean;
}

const ChipGroup: React.FC<ChipGroupProps> = ({
  items,
  selectedId,
  onSelect,
  variant = 'outline',
  bilingual = false,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.wrap}>
      {items.map(item => (
        <Chip
          key={item.id}
          label={bilingual ? formatLabel(item) : item.label}
          icon={item.icon}
          variant={variant}
          selected={selectedId === item.id}
          onPress={() => onSelect(item.id)}
        />
      ))}
    </View>
  );
};

const createStyles = (theme: AppTheme) => {
  const { spacing } = theme;

  return StyleSheet.create({
    wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  });
};

export default React.memo(ChipGroup);
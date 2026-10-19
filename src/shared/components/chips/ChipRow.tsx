// src/shared/components/chips/ChipRow.tsx
//
// Horizontal scrolling chips row.
// Label format yahin fix hai: "English / हिंदी" (labelHindi na ho to sirf English).

import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';
import Chip from './Chip';

// theme se independent layout constant (screens ke H_PADDING jaisa)
const H_PADDING = 16;

export interface ChipItem {
  id: string;
  label: string;
  labelHindi?: string;
  /** MaterialCommunityIcons ka naam (optional) */
  icon?: string;
}

interface ChipRowProps {
  items: ChipItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const formatLabel = (item: ChipItem) =>
  item.labelHindi ? `${item.label} / ${item.labelHindi}` : item.label;

const ChipRow: React.FC<ChipRowProps> = ({ items, selectedId, onSelect }) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      {items.map(item => (
        <Chip
          key={item.id}
          label={formatLabel(item)}
          icon={item.icon}
          selected={selectedId === item.id}
          onPress={() => onSelect(item.id)}
        />
      ))}
    </ScrollView>
  );
};

const createStyles = (theme: AppTheme) => {
  const { spacing } = theme;

  return StyleSheet.create({
    // flexShrink:0 — neeche grid kitna bhi bada ho, row compress nahi hoti
    scroll: { flexGrow: 0, flexShrink: 0 },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: H_PADDING,
      paddingVertical: spacing.xs,
    },
  });
};

export default React.memo(ChipRow);
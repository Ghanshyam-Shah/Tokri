// src/features/catalog/components/CategoryChips.tsx

import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';
import { Category } from '../data/catalogData';
import { H_PADDING } from '../constants/layout';

interface Props {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

const CategoryChips = ({ categories, selected, onSelect }: Props) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {categories.map(cat => {
        const active = selected === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.8}
            style={[styles.chip, active ? styles.active : styles.inactive]}
          >
            <Text
              style={[
                styles.text,
                { color: active ? colors.onPrimary : colors.textMuted },
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
};

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;

  return StyleSheet.create({
    scroll: { flexGrow: 0, flexShrink: 0 },
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
    active: { backgroundColor: colors.primary, borderColor: colors.primary },
    inactive: { borderColor: colors.border },
    text: { fontSize: typography.xs + 1, fontFamily: fontFamilies.medium },
  });
};

export default React.memo(CategoryChips);
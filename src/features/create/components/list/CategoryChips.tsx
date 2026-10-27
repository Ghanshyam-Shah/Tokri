// src/features/create/components/list/CategoryChips.tsx
// Horizontal category chips (All / Vegetables / ...)

import React from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';
import { H_PADDING, Category } from '../../constants/listDefaults';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;

  return StyleSheet.create({
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
    active: { backgroundColor: colors.primary, borderColor: colors.primary },
    inactive: { borderColor: colors.border },
    text: { fontSize: typography.xs + 1, fontFamily: fontFamilies.medium },
  });
};

const useStyles = makeUseStyles(createStyles);

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
    const { theme, styles: ch } = useStyles();
    const { colors } = theme;

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
  },
);

export default CategoryChips;

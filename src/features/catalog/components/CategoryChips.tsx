// src/features/catalog/components/CategoryChips.tsx

import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Category {
  id: string;
  label: string;
  labelHindi: string;
}

interface CategoryChipsProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const DARK = {
  primary: '#f97316',
  textMuted: '#a78b7d',
  chipBorder: '#584237',
};

const H_PADDING = 16;

const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsRow}
      style={styles.chipsScrollView}
    >
      {categories.map(cat => {
        const active = selectedCategory === cat.id;

        return (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            onPress={() => onCategorySelect(cat.id)}
            style={[
              styles.chip,
              active ? styles.chipActive : styles.chipInactive,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: active ? '#fff' : DARK.textMuted,
                },
              ]}
            >
              {cat.label} / {cat.labelHindi}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chipsScrollView: {
    flexGrow: 0,
  },

  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: H_PADDING,
    paddingBottom: 14,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
  },

  chipActive: {
    backgroundColor: DARK.primary,
    borderColor: DARK.primary,
  },

  chipInactive: {
    borderColor: DARK.chipBorder,
  },

  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default React.memo(CategoryChips);

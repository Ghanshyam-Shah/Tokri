// src/features/auth/components/AuthTabs.tsx
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

interface Props<T extends string> {
  items: { id: T; label: string }[];
  selected: T;
  onSelect: (id: T) => void;
}

function AuthTabs<T extends string>({ items, selected, onSelect }: Props<T>) {
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={s.wrap}>
      {items.map(it => {
        const active = it.id === selected;
        return (
          <TouchableOpacity
            key={it.id}
            onPress={() => onSelect(it.id)}
            activeOpacity={0.85}
            style={[s.tab, active && s.tabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text style={[s.txt, active && s.txtActive]}>{it.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } = theme;
  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      padding: spacing.xs,
      gap: spacing.xs,
      borderRadius: borderRadius.md + 2,
      backgroundColor: colors.cardBgVariant,
    },
    tab: {
      flex: 1,
      height: 44,
      borderRadius: borderRadius.md - 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabActive: { backgroundColor: colors.cardBg, ...shadows.sm },
    txt: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.semiBold,
      color: colors.textMuted,
    },
    txtActive: { color: colors.textPrimary },
  });
};

export default AuthTabs;

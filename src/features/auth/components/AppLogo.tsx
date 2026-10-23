// src/features/auth/components/AppLogo.tsx
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

interface Props {
  size?: number; // logo box size
  tagline?: string;
}

const AppLogo: React.FC<Props> = ({ size = 68, tagline }) => {
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme, size), [theme, size]);

  return (
    <View style={s.wrap}>
      <View style={s.box}>
        <Icon name="basket-outline" size={size * 0.55} color={theme.colors.onPrimary} />
      </View>
      <Text style={s.name}>Tokri</Text>
      {tagline ? <Text style={s.tagline}>{tagline}</Text> : null}
    </View>
  );
};

const createStyles = (theme: Theme, size: number) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  return StyleSheet.create({
    wrap: { alignItems: 'center', gap: spacing.sm },
    box: {
      width: size,
      height: size,
      borderRadius: Math.max(borderRadius.lg, size * 0.3),
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      fontSize: typography.xl + 4,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },
    tagline: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });
};

export default AppLogo;

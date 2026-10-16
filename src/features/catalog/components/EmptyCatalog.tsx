// src/features/catalog/components/EmptyCatalog.tsx

import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';

const EmptyCatalog = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.wrap}>
      <Icon name="basket-off-outline" size={52} color={colors.textMuted} />
      <Text style={styles.title}>Koi product nahi mila</Text>
      <Text style={styles.sub}>Try another search or category</Text>
    </View>
  );
};

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, typography, fontFamilies } = theme;

  return StyleSheet.create({
    wrap: {
      alignItems: 'center',
      paddingVertical: spacing.giant,
      gap: spacing.sm + 2,
    },
    title: {
      color: colors.textPrimary,
      fontSize: typography.md,
      fontFamily: fontFamilies.semiBold,
    },
    sub: {
      color: colors.textMuted,
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.regular,
    },
  });
};

export default React.memo(EmptyCatalog);
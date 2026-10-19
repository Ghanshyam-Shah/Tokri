// src/shared/components/states/EmptyState.tsx
//
// Khali list / no-result state. FlatList ke ListEmptyComponent me use karo.
// Icon MaterialCommunityIcons ka naam hai.

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'basket-off-outline',
  title,
  subtitle,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={48} color={theme.colors.primary} />
      </View>

      <Text style={styles.title}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, typography, fontFamilies } = theme;

  return StyleSheet.create({
    wrap: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
      paddingHorizontal: spacing.xxxl,
    },
    iconWrap: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    title: {
      fontSize: typography.lg,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
};

export default React.memo(EmptyState);
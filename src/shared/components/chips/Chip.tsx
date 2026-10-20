// src/shared/components/chips/Chip.tsx
//
// Ek single pill/chip. Selected -> primary fill.
// variant:
//   'outline' (default) -> unselected me sirf border   (search/filter rows)
//   'filled'            -> unselected me halka background (forms / cards ke upar)
// icon optional.

import React, { useMemo } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';

export type ChipVariant = 'outline' | 'filled';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** MaterialCommunityIcons ka naam (optional) */
  icon?: string;
  variant?: ChipVariant;
}

const Chip: React.FC<ChipProps> = ({
  label,
  selected,
  onPress,
  icon,
  variant = 'outline',
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const contentColor = selected ? colors.onPrimary : colors.textMuted;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.chip,
        selected
          ? styles.active
          : variant === 'filled'
            ? styles.inactiveFilled
            : styles.inactive,
      ]}
    >
      {icon ? (
        <Icon name={icon} size={13} color={contentColor} style={styles.icon} />
      ) : null}
      <Text
        style={[styles.text, { color: contentColor }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;

  return StyleSheet.create({
    chip: {
      flexShrink: 0, // chips compress nahi hone chahiye
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md + 2,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      borderWidth: 1,
    },
    active: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    inactive: {
      borderColor: colors.border,
    },
    inactiveFilled: {
      borderColor: colors.border,
      backgroundColor: colors.cardBgVariant,
    },
    icon: { marginRight: 5 },
    text: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.medium,
    },
  });
};

export default React.memo(Chip);
// src/features/auth/components/AuthHeading.tsx
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

interface Props {
  title: string;
  subtitle?: string;
  icon?: string; // MaterialCommunityIcons name (OTP / forgot screens)
  align?: 'left' | 'center';
}

const AuthHeading: React.FC<Props> = ({
  title,
  subtitle,
  icon,
  align = 'left',
}) => {
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme, align), [theme, align]);

  return (
    <View style={s.wrap}>
      {icon ? (
        <View style={s.iconBox}>
          <Icon name={icon} size={34} color={theme.colors.primary} />
        </View>
      ) : null}
      <Text style={s.title}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const createStyles = (theme: Theme, align: 'left' | 'center') => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  return StyleSheet.create({
    wrap: {
      alignItems: align === 'center' ? 'center' : 'flex-start',
      gap: spacing.sm,
    },
    iconBox: {
      width: 72,
      height: 72,
      borderRadius: borderRadius.xl,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    title: {
      fontSize: typography.xl + 2,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      textAlign: align,
    },
    subtitle: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      textAlign: align,
      lineHeight: 20,
    },
  });
};

export default AuthHeading;

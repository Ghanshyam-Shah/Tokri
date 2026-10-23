// src/features/auth/components/AuthMessage.tsx
// Error / success message box. Optional action link (e.g. "Register").
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

interface Props {
  type: 'error' | 'success';
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

const AuthMessage: React.FC<Props> = ({ type, text, actionLabel, onAction }) => {
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme), [theme]);
  const color = type === 'error' ? theme.colors.error : theme.colors.success;

  return (
    <View style={[s.box, { borderColor: color }]}>
      <Icon
        name={type === 'error' ? 'alert-circle-outline' : 'check-circle-outline'}
        size={18}
        color={color}
      />
      <Text style={s.txt}>
        {text}
        {actionLabel && onAction ? (
          <Text style={[s.action, { color }]} onPress={onAction}>
            {'  '}
            {actionLabel}
          </Text>
        ) : null}
      </Text>
    </View>
  );
};

const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  return StyleSheet.create({
    box: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      backgroundColor: colors.cardBg,
    },
    txt: {
      flex: 1,
      fontSize: typography.sm,
      fontFamily: fontFamilies.medium,
      color: colors.textPrimary,
    },
    action: { fontFamily: fontFamilies.bold, textDecorationLine: 'underline' },
  });
};

export default AuthMessage;

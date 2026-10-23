// src/features/auth/components/AuthButton.tsx
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  rightIcon?: string; // MaterialCommunityIcons name
}

const AuthButton: React.FC<Props> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  rightIcon,
}) => {
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme), [theme]);
  const off = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={off}
      activeOpacity={0.85}
      style={[s.btn, off && s.btnOff]}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.onPrimary} />
      ) : (
        <>
          <Text style={s.txt}>{title}</Text>
          {rightIcon ? (
            <Icon
              name={rightIcon}
              size={18}
              color={theme.colors.onPrimary}
              style={s.icon}
            />
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) => {
  const { colors, spacing, typography, fontFamilies } = theme;
  return StyleSheet.create({
    btn: {
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnOff: { opacity: 0.6 },
    txt: {
      fontSize: typography.md,
      fontFamily: fontFamilies.semiBold,
      color: colors.onPrimary,
    },
    icon: { marginLeft: spacing.sm },
  });
};

export default AuthButton;

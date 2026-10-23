// src/features/auth/components/AuthInput.tsx
import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

interface Props extends Omit<TextInputProps, 'secureTextEntry' | 'style'> {
  label: string;
  error?: string | null;
  prefix?: string; // e.g. "+91"
  secure?: boolean; // password: show/hide toggle ke saath
}

const AuthInput: React.FC<Props> = ({ label, error, prefix, secure, ...rest }) => {
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme), [theme]);
  const [hidden, setHidden] = useState(!!secure);
  const [focused, setFocused] = useState(false);

  return (
    <View style={s.group}>
      <Text style={s.label}>{label}</Text>

      <View style={s.row}>
        {prefix ? (
          <View style={s.prefix}>
            <Text style={s.prefixTxt}>{prefix}</Text>
          </View>
        ) : null}

        <View
          style={[s.field, focused && s.fieldFocused, !!error && s.fieldError]}
        >
          <TextInput
            {...rest}
            style={s.input}
            secureTextEntry={hidden}
            placeholderTextColor={theme.colors.textMuted}
            onFocus={e => {
              setFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={e => {
              setFocused(false);
              rest.onBlur?.(e);
            }}
          />
          {secure && (
            <TouchableOpacity
              onPress={() => setHidden(h => !h)}
              style={s.eye}
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            >
              <Icon
                name={hidden ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
};

const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  return StyleSheet.create({
    group: { gap: spacing.sm },
    label: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.textMuted,
    },
    row: { flexDirection: 'row', gap: spacing.sm },
    prefix: {
      height: 52,
      paddingHorizontal: spacing.md + 2,
      borderRadius: borderRadius.md,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    prefixTxt: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.semiBold,
      color: colors.textPrimary,
    },
    field: {
      flex: 1,
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: borderRadius.md,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      paddingLeft: spacing.lg,
    },
    fieldFocused: { borderColor: colors.primary },
    fieldError: { borderColor: colors.error },
    input: {
      flex: 1,
      fontSize: typography.md,
      fontFamily: fontFamilies.regular,
      color: colors.textPrimary,
      paddingVertical: 0,
    },
    eye: {
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    error: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.medium,
      color: colors.error,
    },
  });
};

export default AuthInput;

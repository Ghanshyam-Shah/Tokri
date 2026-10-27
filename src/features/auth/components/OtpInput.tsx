// src/features/auth/components/OtpInput.tsx
//
// 6 boxes dikhte hain, par andar ek hi hidden TextInput hai. Isse paste,
// SMS autofill aur backspace sab apne aap sahi chalte hain.

import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

interface Props {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  hasError?: boolean;
}

const OtpInput: React.FC<Props> = ({
  value,
  onChange,
  length = 6,
  hasError = false,
}) => {
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme), [theme]);
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={s.row}>
      {Array.from({ length }).map((_, i) => {
        const active = focused && i === Math.min(value.length, length - 1);
        return (
          <View
            key={i}
            style={[s.box, active && s.boxActive, hasError && s.boxError]}
          >
            <Text style={s.digit}>{value[i] ?? ''}</Text>
          </View>
        );
      })}

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={t => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        caretHidden
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={`${length} digit OTP`}
        style={s.hidden}
      />
    </Pressable>
  );
};

const createStyles = (theme: Theme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  return StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
    box: {
      flex: 1,
      maxWidth: 52,
      height: 58,
      borderRadius: borderRadius.md,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    boxActive: { borderColor: colors.primary, borderWidth: 2 },
    boxError: { borderColor: colors.error },
    digit: {
      fontSize: typography.xl,
      fontFamily: fontFamilies.semiBold,
      color: colors.textPrimary,
    },
    hidden: { ...StyleSheet.absoluteFill, opacity: 0 },
  });
};

export default OtpInput;

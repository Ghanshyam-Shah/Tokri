// src/features/auth/components/AuthFooterLink.tsx
// "New user? Register" jaisa footer text + link
import React, { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

interface Props {
  text: string;
  linkLabel: string;
  onPress: () => void;
}

const AuthFooterLink: React.FC<Props> = ({ text, linkLabel, onPress }) => {
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme), [theme]);

  return (
    <Text style={s.txt}>
      {text}{' '}
      <Text style={s.link} onPress={onPress} accessibilityRole="link">
        {linkLabel}
      </Text>
    </Text>
  );
};

const createStyles = (theme: Theme) => {
  const { colors, typography, fontFamilies } = theme;
  return StyleSheet.create({
    txt: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      textAlign: 'center',
    },
    link: { fontFamily: fontFamilies.bold, color: colors.primary },
  });
};

export default AuthFooterLink;

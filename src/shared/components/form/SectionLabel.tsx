// src/shared/components/form/SectionLabel.tsx
// Section ka chhota title: [icon] ENGLISH / हिन्दी

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { makeUseStyles, AppTheme } from '../../utils/makeUseStyles';

const createStyles = (theme: AppTheme) => {
  const { colors, typography, fontFamilies, spacing } = theme;

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs + 2,
      marginBottom: spacing.md + 2,
    },
    en: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.bold,
      color: colors.primary,
      letterSpacing: 0.8,
    },
    slash: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      opacity: 0.5,
    },
    hi: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.hindi ?? fontFamilies.semiBold,
      color: colors.primary,
    },
  });
};

const useStyles = makeUseStyles(createStyles);

interface Props {
  icon: string;
  en: string;
  hi: string;
}

const SectionLabel = React.memo(({ icon, en, hi }: Props) => {
  const { theme, styles: sec } = useStyles();
  const { colors } = theme;

  return (
    <View style={sec.row}>
      <Icon name={icon} size={14} color={colors.primary} />
      <Text style={sec.en}>{en}</Text>
      <Text style={sec.slash}>/</Text>
      <Text style={sec.hi}>{hi}</Text>
    </View>
  );
});

export default SectionLabel;

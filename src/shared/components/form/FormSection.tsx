// src/shared/components/form/FormSection.tsx
// Form ka card: upar SectionLabel, neeche children.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { makeUseStyles, AppTheme } from '../../utils/makeUseStyles';
import SectionLabel from './SectionLabel';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, shadows } = theme;

  return StyleSheet.create({
    section: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },
  });
};

const useStyles = makeUseStyles(createStyles);

interface Props {
  icon: string;
  en: string;
  hi: string;
  children: React.ReactNode;
}

const FormSection = ({ icon, en, hi, children }: Props) => {
  const { styles } = useStyles();

  return (
    <View style={styles.section}>
      <SectionLabel icon={icon} en={en} hi={hi} />
      {children}
    </View>
  );
};

export default FormSection;

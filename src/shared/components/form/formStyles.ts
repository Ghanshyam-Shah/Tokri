// src/shared/components/form/formStyles.ts
// Form screens (AddItem / EditItem ...) ke common styles: label, input, button icon.

import { StyleSheet } from 'react-native';
import { makeUseStyles, AppTheme } from '../../utils/makeUseStyles';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  const inputBg = colors.cardBgVariant;

  return StyleSheet.create({
    fieldLabel: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.medium,
      color: colors.textMuted,
      marginBottom: spacing.sm,
    },
    fieldLabelSpaced: { marginTop: spacing.md + 2 },
    fieldLabelEn: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },

    input: {
      height: spacing.huge,
      backgroundColor: inputBg,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md + 2,
      fontSize: typography.sm,
      fontFamily: fontFamilies.medium,
      color: colors.textPrimary,
    },
    inputFlex: { flex: 1 },
    btnIcon: { marginRight: 6 },
  });
};

export const useFormStyles = makeUseStyles(createStyles);

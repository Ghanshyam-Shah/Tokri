// src/features/catalog/components/form/ItemFormFooter.tsx
// Sticky footer: Cancel + primary button (Add Item / Save Changes)

import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';
import { useFormStyles } from '../../../../shared/components/form/formStyles';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } = theme;
  const onPrimary = colors.onPrimary;

  return StyleSheet.create({
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.appBackground,
      gap: spacing.sm + 2,
    },
    btnPrimary: {
      flex: 1,
      height: spacing.huge,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.md,
    },
    btnPrimaryText: {
      color: onPrimary,
      fontSize: typography.md,
      fontFamily: fontFamilies.bold,
      letterSpacing: 0.3,
    },
    btnSecondary: {
      flex: 1,
      height: spacing.huge,
      borderRadius: borderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnSecondaryText: {
      fontSize: typography.sm + 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.textMuted,
    },
  });
};

const useStyles = makeUseStyles(createStyles);

interface Props {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  submitIcon: string;
  loading?: boolean; // save chal raha ho to buttons band + spinner
}

const ItemFormFooter = ({
  onCancel,
  onSubmit,
  submitLabel,
  submitIcon,
  loading = false,
}: Props) => {
  const { theme, styles } = useStyles();
  const { styles: form } = useFormStyles();
  const onPrimary = theme.colors.onPrimary;

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={onCancel}
        disabled={loading}
        activeOpacity={0.75}
        style={[styles.btnSecondary, loading && { opacity: 0.5 }]}
      >
        <Text style={styles.btnSecondaryText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSubmit}
        disabled={loading}
        activeOpacity={0.85}
        style={[styles.btnPrimary, loading && { opacity: 0.7 }]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={onPrimary} style={form.btnIcon} />
        ) : (
          <Icon
            name={submitIcon}
            size={20}
            color={onPrimary}
            style={form.btnIcon}
          />
        )}
        <Text style={styles.btnPrimaryText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ItemFormFooter;

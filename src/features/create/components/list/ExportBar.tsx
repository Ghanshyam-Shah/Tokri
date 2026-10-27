// src/features/create/components/list/ExportBar.tsx
// Bottom bar: Save as Draft + Download

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon2 from 'react-native-vector-icons/Feather';
import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';
import { H_PADDING } from '../../constants/listDefaults';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } = theme;
  const onPrimary = colors.onPrimary; // primary ke upar ka text/icon

  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: H_PADDING,
      paddingVertical: spacing.xs + 2,
      backgroundColor: colors.appBackground,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      gap: spacing.sm + 2,
    },
    btn: {
      flex: 1,
      height: 46,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    draftBtn: { borderWidth: 1.5, borderColor: colors.primary },
    downloadBtn: { backgroundColor: colors.primary, ...shadows.sm },
    btnDisabled: { opacity: 0.4 },
    draftTxt: {
      fontSize: typography.sm + 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.primary,
    },
    downloadTxt: {
      fontSize: typography.sm + 1,
      fontFamily: fontFamilies.semiBold,
      color: onPrimary,
    },
  });
};

const useStyles = makeUseStyles(createStyles);

const ExportBar = React.memo(
  ({
    onSaveDraft,
    onDownload,
    disabled,
  }: {
    onSaveDraft: () => void;
    onDownload: () => void;
    disabled: boolean;
  }) => {
    const { theme, styles: xb } = useStyles();
    const { colors } = theme;

    return (
      <View style={xb.wrap}>
        <TouchableOpacity
          onPress={onSaveDraft}
          activeOpacity={0.85}
          style={[xb.btn, xb.draftBtn]}
        >
          <Text style={xb.draftTxt}>Save as Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDownload}
          disabled={disabled}
          activeOpacity={0.9}
          style={[xb.btn, xb.downloadBtn, disabled && xb.btnDisabled]}
        >
          {/* <Icon2 name="download" size={20} color={colors.onPrimary} /> */}
          <Icon2 name="download" size={20} color={colors.onPrimary} style={{ transform: [{ scaleX: -1 }] }} />

          {/* <Icon2 name="person-walking-luggage" size={20} color={colors.onPrimary} style={{ transform: [{ scaleX: -1 }] }}/> */}

          <Text style={xb.downloadTxt}>Download</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

export default ExportBar;

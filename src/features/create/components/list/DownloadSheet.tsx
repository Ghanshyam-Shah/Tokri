// src/features/create/components/list/DownloadSheet.tsx
// Download bottom sheet: Save as PDF / Save as Image

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from '../../../../shared/components/sheets/BottomSheet';
import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  const primaryMuted = colors.primaryMuted; // 6-digit hex hona chahiye

  return StyleSheet.create({
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md + 2,
      borderRadius: borderRadius.lg - 2,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.sm + 2,
    },
    optionIcon: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      backgroundColor: primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionTitle: {
      fontSize: typography.sm + 1,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },
    optionSub: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      marginTop: 2,
    },
  });
};

const useStyles = makeUseStyles(createStyles);

const DownloadSheet = React.memo(
  ({
    visible,
    onClose,
    onDismissed,
    onPdf,
    onImage,
  }: {
    visible: boolean;
    onClose: () => void;
    onDismissed: () => void;
    onPdf: () => void;
    onImage: () => void;
  }) => {
    const { theme, styles: dl } = useStyles();
    const { colors } = theme;

    return (
      <BottomSheet
        visible={visible}
        onClose={onClose}
        onDismissed={onDismissed}
        title="Download"
        subtitle="Choose a format"
      >
        <TouchableOpacity style={dl.option} onPress={onPdf} activeOpacity={0.85}>
          <View style={dl.optionIcon}>
            <Icon name="file-pdf-box" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={dl.optionTitle}>Save as PDF</Text>
            <Text style={dl.optionSub}>
              A printable list with quantities and notes
            </Text>
          </View>
          <Icon name="chevron-right" size={22} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={dl.option}
          onPress={onImage}
          activeOpacity={0.85}
        >
          <View style={dl.optionIcon}>
            <Icon name="image-outline" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={dl.optionTitle}>Save as Image</Text>
            <Text style={dl.optionSub}>A picture of your list, easy to share</Text>
          </View>
          <Icon name="chevron-right" size={22} color={colors.textMuted} />
        </TouchableOpacity>
      </BottomSheet>
    );
  },
);

export default DownloadSheet;

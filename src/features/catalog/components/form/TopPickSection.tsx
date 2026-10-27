// src/features/catalog/components/form/TopPickSection.tsx
// Top Pick toggle card

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';
import FormSection from '../../../../shared/components/form/FormSection';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;

  return StyleSheet.create({
    topPickCard: {
      minHeight: 70,
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderWidth: 1.5,
      borderRadius: borderRadius.md,
    },
    topPickIcon: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md - 2,
      backgroundColor: colors.cardBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.sm + 2,
    },
    topPickInfo: { flex: 1 },
    topPickTitle: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      marginBottom: 3,
    },
    topPickSubtitle: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
    },
    checkBox: {
      width: 24,
      height: 24,
      borderRadius: 7,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

const useStyles = makeUseStyles(createStyles);

interface Props {
  isTopPick: boolean;
  onToggle: () => void;
}

const TopPickSection = ({ isTopPick, onToggle }: Props) => {
  const { theme, styles } = useStyles();
  const { colors } = theme;
  const onPrimary = colors.onPrimary;

  return (
    <FormSection icon="star-outline" en="VISIBILITY" hi="दिखावट">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        style={[
          styles.topPickCard,
          {
            backgroundColor: isTopPick
              ? colors.primaryMuted
              : colors.cardBgVariant,
            borderColor: isTopPick ? colors.primary : colors.border,
          },
        ]}
      >
        <View style={styles.topPickIcon}>
          <Icon
            name={isTopPick ? 'star' : 'star-outline'}
            size={22}
            color={colors.primary}
          />
        </View>
        <View style={styles.topPickInfo}>
          <Text style={styles.topPickTitle}>Top Pick</Text>
          <Text style={styles.topPickSubtitle}>
            Is product ko Top Pick mein show karein
          </Text>
        </View>
        <View
          style={[
            styles.checkBox,
            {
              backgroundColor: isTopPick ? colors.primary : 'transparent',
              borderColor: isTopPick ? colors.primary : colors.border,
            },
          ]}
        >
          {isTopPick && <Icon name="check" size={16} color={onPrimary} />}
        </View>
      </TouchableOpacity>
    </FormSection>
  );
};

export default TopPickSection;

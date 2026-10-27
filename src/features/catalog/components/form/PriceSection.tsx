// src/features/catalog/components/form/PriceSection.tsx
// Price input (₹)

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';
import FormSection from '../../../../shared/components/form/FormSection';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  const inputBg = colors.cardBgVariant;

  return StyleSheet.create({
    priceInputWrapper: {
      height: spacing.huge,
      backgroundColor: inputBg,
      borderWidth: 1.5,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md + 2,
    },
    rupee: {
      fontSize: typography.lg,
      fontFamily: fontFamilies.semiBold,
      color: colors.primary,
    },
    priceInput: {
      flex: 1,
      height: '100%',
      marginLeft: spacing.sm,
      fontSize: typography.sm,
      fontFamily: fontFamilies.medium,
      color: colors.textPrimary,
    },
  });
};

const useStyles = makeUseStyles(createStyles);

interface Props {
  price: string;
  onChangePrice: (v: string) => void;
}

const PriceSection = ({ price, onChangePrice }: Props) => {
  const { theme, styles } = useStyles();
  const { colors } = theme;

  return (
    <FormSection icon="cash" en="PRICE" hi="कीमत">
      <View
        style={[
          styles.priceInputWrapper,
          { borderColor: price ? colors.primary : colors.border },
        ]}
      >
        <Text style={styles.rupee}>₹</Text>
        <TextInput
          value={price}
          onChangeText={onChangePrice}
          placeholder="e.g. 120"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          style={styles.priceInput}
        />
      </View>
    </FormSection>
  );
};

export default PriceSection;

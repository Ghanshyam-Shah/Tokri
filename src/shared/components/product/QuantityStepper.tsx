// src/shared/components/product/QuantityStepper.tsx
//
// Chhota  −  count  +  stepper (product card aur list preview dono me).

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onIncrease,
  onDecrease,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={onDecrease}
        style={styles.btn}
        activeOpacity={0.75}
      >
        <Icon name="minus" size={13} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.count}>{quantity}</Text>

      <TouchableOpacity
        onPress={onIncrease}
        style={[styles.btn, styles.btnFilled]}
        activeOpacity={0.75}
      >
        <Icon name="plus" size={13} color={colors.onPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: AppTheme) => {
  const { colors, typography, fontFamilies } = theme;

  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    btn: {
      width: 26,
      height: 26,
      borderRadius: 7,
      borderWidth: 1.5,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnFilled: { backgroundColor: colors.primary },
    count: {
      fontSize: typography.sm,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
      minWidth: 18,
      textAlign: 'center',
    },
  });
};

export default React.memo(QuantityStepper);
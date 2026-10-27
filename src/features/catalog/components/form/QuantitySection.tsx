// src/features/catalog/components/form/QuantitySection.tsx
// Default quantity: unit tabs + stepper + quick select

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { makeUseStyles, AppTheme } from '../../../../shared/utils/makeUseStyles';
import FormSection from '../../../../shared/components/form/FormSection';
import { UNITS } from '../../constants/productFormDefaults';

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;
  const inputBg = colors.cardBgVariant;
  const primaryMuted = colors.primaryMuted; // 6-digit hex hona chahiye

  return StyleSheet.create({
    unitContainer: {
      flexDirection: 'row',
      backgroundColor: inputBg,
      borderRadius: borderRadius.md,
      padding: spacing.xs,
      marginBottom: spacing.md,
    },
    unitTab: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: borderRadius.sm,
    },
    unitTabActive: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    unitTabText: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.textMuted,
    },
    unitTabTextActive: { color: colors.primary },

    qtyControlRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    stepBtn: {
      width: 44,
      height: spacing.huge,
      backgroundColor: inputBg,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    qtyInputWrapper: {
      flex: 1,
      height: spacing.huge,
      backgroundColor: inputBg,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
    },
    qtyInput: {
      flex: 1,
      fontSize: typography.sm + 1,
      fontFamily: fontFamilies.semiBold,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    listIconBtn: {
      paddingLeft: spacing.sm + 2,
      borderLeftWidth: 1,
      borderLeftColor: colors.border,
    },

    quickSelectGrid: {
      marginTop: spacing.md,
      padding: spacing.md,
      backgroundColor: colors.cardBgVariant,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickTitle: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.bold,
      color: colors.textMuted,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
    },
    quickOptionsWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    quickOption: {
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.sm - 2,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickOptionActive: {
      borderColor: colors.primary,
      backgroundColor: primaryMuted,
    },
    quickOptionText: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.medium,
      color: colors.textPrimary,
    },
    quickOptionTextActive: {
      color: colors.primary,
      fontFamily: fontFamilies.bold,
    },
  });
};

const useStyles = makeUseStyles(createStyles);

interface Props {
  quantity: string;
  unit: string;
  onChangeQuantity: (v: string) => void;
  onChangeUnit: (v: string) => void;
}

const QuantitySection = ({
  quantity,
  unit,
  onChangeQuantity,
  onChangeUnit,
}: Props) => {
  const { theme, styles } = useStyles();
  const { colors } = theme;
  const [showQuickSelect, setShowQuickSelect] = useState(false);

  const handleStep = (type: 'plus' | 'minus') => {
    const current = parseFloat(quantity) || 0;
    const step = unit === 'g' || unit === 'ml' ? 50 : 1;
    if (type === 'plus') {
      onChangeQuantity((current + step).toString());
    } else if (current > step) {
      onChangeQuantity((current - step).toString());
    } else if (current > 0) {
      onChangeQuantity('0');
    }
  };

  const getQuickOptions = () => {
    if (unit === 'g' || unit === 'ml')
      return [50, 100, 200, 250, 350, 400, 500, 750, 900];
    return [1, 2, 5, 10, 15, 20, 25, 50];
  };

  return (
    <FormSection icon="scale-balance" en="DEFAULT QUANTITY" hi="डिफ़ॉल्ट मात्रा">
      <View style={styles.unitContainer}>
        {UNITS.map(item => (
          <TouchableOpacity
            key={item}
            onPress={() => onChangeUnit(item)}
            style={[styles.unitTab, unit === item && styles.unitTabActive]}
          >
            <Text
              style={[
                styles.unitTabText,
                unit === item && styles.unitTabTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.qtyControlRow}>
        <TouchableOpacity
          onPress={() => handleStep('minus')}
          style={styles.stepBtn}
        >
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.qtyInputWrapper}>
          <TextInput
            value={quantity}
            onChangeText={text => {
              if (/^\d*\.?\d*$/.test(text)) onChangeQuantity(text);
            }}
            keyboardType="decimal-pad"
            style={styles.qtyInput}
          />
          <TouchableOpacity
            onPress={() => setShowQuickSelect(!showQuickSelect)}
            style={styles.listIconBtn}
          >
            <Icon
              name={showQuickSelect ? 'chevron-up' : 'format-list-bulleted'}
              size={20}
              color={showQuickSelect ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => handleStep('plus')}
          style={styles.stepBtn}
        >
          <Icon name="chevron-right" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {showQuickSelect && (
        <View style={styles.quickSelectGrid}>
          <Text style={styles.quickTitle}>Quick Select ({unit}):</Text>
          <View style={styles.quickOptionsWrapper}>
            {getQuickOptions().map(val => {
              const active = quantity === val.toString();
              return (
                <TouchableOpacity
                  key={val}
                  onPress={() => onChangeQuantity(val.toString())}
                  style={[
                    styles.quickOption,
                    active && styles.quickOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.quickOptionText,
                      active && styles.quickOptionTextActive,
                    ]}
                  >
                    {val} {unit}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </FormSection>
  );
};

export default QuantitySection;

// src/shared/components/searchBar/SearchBar.tsx
//
// Reusable themed search input.
// - Controlled: value + onChangeText parent se.
// - Clear (x) button apne aap aata hai jab text ho.
// - Default: returnKeyType="search", autoCorrect={false}
//   (Hindi/Hinglish naam likhte waqt keyboard auto-correct nahi karega).
//   Kisi screen ko alag chahiye to wohi prop pass karke override kar sakti hai.
// - Outer spacing (margin) yahan nahi hai; screen containerStyle se deti hai.

import React, { useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';

export interface SearchBarProps
  extends Omit<TextInputProps, 'style' | 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Bahar ki spacing / width wagairah (margin etc.) */
  containerStyle?: StyleProp<ViewStyle>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search / खोजें...',
  containerStyle,
  ...inputProps
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.wrap, containerStyle]}>
      <Icon
        name="magnify"
        size={20}
        color={colors.textMuted}
        style={styles.icon}
      />

      <TextInput
        returnKeyType="search"
        autoCorrect={false}
        {...inputProps}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          activeOpacity={0.75}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;

  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBgVariant,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      height: 44,
    },
    icon: { marginRight: spacing.sm },
    input: {
      flex: 1,
      fontSize: typography.sm,
      fontFamily: fontFamilies.regular,
      color: colors.textPrimary,
      paddingVertical: 0,
    },
  });
};

export default React.memo(SearchBar);
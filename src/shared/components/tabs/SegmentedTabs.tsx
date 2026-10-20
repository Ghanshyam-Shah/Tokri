// src/shared/components/tabs/SegmentedTabs.tsx
//
// Chhote do/teen tabs ka segmented control (jaise Old Lists | My Templates).
// Content render karna parent ka kaam hai: yeh sirf selection dikhata hai.

import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';

export interface SegmentTab {
  id: string;
  label: string;
  /** MaterialCommunityIcons ka naam (optional) */
  icon?: string;
}

interface SegmentedTabsProps {
  tabs: SegmentTab[];
  selectedId: string;
  onSelect: (id: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  selectedId,
  onSelect,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.wrap, containerStyle]}>
      {tabs.map(tab => {
        const active = tab.id === selectedId;
        const contentColor = active ? colors.onPrimary : colors.textMuted;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onSelect(tab.id)}
            activeOpacity={0.8}
            style={[styles.tab, active && styles.tabActive]}
          >
            {tab.icon ? (
              <Icon
                name={tab.icon}
                size={15}
                color={contentColor}
                style={styles.icon}
              />
            ) : null}
            <Text
              style={[styles.text, { color: contentColor }]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, typography, fontFamilies } = theme;

  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      backgroundColor: colors.cardBgVariant,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xs,
      gap: spacing.xs,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md - 2,
    },
    tabActive: { backgroundColor: colors.primary },
    icon: { marginRight: 6 },
    text: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.semiBold,
    },
  });
};

export default React.memo(SegmentedTabs);
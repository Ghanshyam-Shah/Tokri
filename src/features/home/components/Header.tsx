import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../app/providers/ThemeProvider';

const COLORS = {
  background: '#fcf9f4',
  surface: '#ffffff',
  primary: '#f97316',
  primaryDark: '#9d4300',
  textPrimary: '#1c1c19',
  textSecondary: '#584237',
  border: '#e5e2dd',
  success: '#006d30',
  successLight: '#95f8a7',
};

export default function Header() {
  const { theme, isDark, toggleTheme } = useTheme();

  const { colors, borderRadius, shadows, fontFamilies, typography, spacing } =
    theme;
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity activeOpacity={0.8}>
          <Icon name="menu" size={28} color={COLORS.primaryDark} />
        </TouchableOpacity>

        <Text style={styles.logo}>KiranaList</Text>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity activeOpacity={0.8}>
          {/* <Icon name="bell-outline" size={24} color={COLORS.textSecondary} /> */}
          <Icon
            name={isDark ? 'white-balance-sunny' : 'weather-night'}
            size={22}
            color={isDark ? '#FCD34D' : '#818CF8'}
          />
        </TouchableOpacity>

        {/* <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1581579438747-104c53d5b8ff?w=300&q=80',
                  }}
                  style={styles.profile}
                /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.successLight,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  profile: {
    width: 40,
    height: 40,
    borderRadius: 999,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
});

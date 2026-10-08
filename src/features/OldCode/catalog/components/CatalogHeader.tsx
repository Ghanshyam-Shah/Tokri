// src/shared/components/headers/CatalogHeader.tsx

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../app/providers/ThemeProvider';

const HEADER_H = Platform.OS === 'ios' ? 48 : 54;

const H_PADDING = 16;

interface CatalogHeaderProps {
  title: string;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({ title }) => {
  const navigation = useNavigation();

  const { theme, isDark, toggleTheme } = useTheme();

  const { colors, borderRadius, shadows, fontFamilies, typography } = theme;

  const drawerAnim = useRef(new Animated.Value(1)).current;
  const themeAnim = useRef(new Animated.Value(1)).current;

  const springPress = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.spring(anim, {
        toValue: 0.78,
        useNativeDriver: true,
        speed: 60,
        bounciness: 4,
      }),

      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 25,
        bounciness: 10,
      }),
    ]).start();
  };

  const handleDrawer = () => {
    springPress(drawerAnim);

    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleTheme = () => {
    springPress(themeAnim);

    toggleTheme();
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.appBackground}
        translucent={false}
      />

      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.appBackground,
            ...shadows.sm,
          },
        ]}
      >
        {/* LEFT — Drawer */}
        <Animated.View
          style={{
            transform: [{ scale: drawerAnim }],
          }}
        >
          <TouchableOpacity
            onPress={handleDrawer}
            activeOpacity={0.75}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
            style={[
              styles.headerIconBtn,
              {
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            <Icon name="menu" size={28} color={colors.headerContent} />
          </TouchableOpacity>
        </Animated.View>

        {/* CENTER — Title */}
        <Text
          numberOfLines={1}
          style={[
            styles.headerTitle,
            {
              color: colors.headerContent,
              fontFamily: fontFamilies.bold,
              fontSize: typography.lg,
              letterSpacing: 0.3,
            },
          ]}
        >
          {title}
        </Text>

        {/* RIGHT — Theme Toggle */}
        <Animated.View
          style={{
            transform: [{ scale: themeAnim }],
          }}
        >
          <TouchableOpacity
            onPress={handleTheme}
            activeOpacity={0.75}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
            style={[
              styles.headerIconBtn,
              {
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            <Icon
              name={isDark ? 'white-balance-sunny' : 'weather-night'}
              size={22}
              color={isDark ? '#FCD34D' : '#818CF8'}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: HEADER_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING,
  },

  headerIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default React.memo(CatalogHeader);

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';

import { DrawerActions, useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../hooks/useTheme';

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title = 'KiranaList' }) => {
  const navigation = useNavigation();

  const { theme, isDark, toggleTheme } = useTheme();

  const { colors, borderRadius, shadows, fontFamilies, typography, spacing } =
    theme;

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
          styles.container,
          {
            backgroundColor: colors.appBackground,
            paddingHorizontal: spacing.lg,
            ...shadows.sm,
          },
        ]}
      >
        {/* ══ LEFT — Drawer icon ══ */}
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
              styles.iconBtn,
              {
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            <Icon name="menu" size={26} color={colors.headerContent} />
          </TouchableOpacity>
        </Animated.View>

        {/* ══ CENTER — Title ══ */}
        <Text
          numberOfLines={1}
          style={[
            styles.title,
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

        {/* ══ RIGHT — Theme toggle ══ */}
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
              styles.iconBtn,
              {
                borderRadius: borderRadius.sm,
              },
            ]}
          >
            <Icon
              name={isDark ? 'white-balance-sunny' : 'weather-night'}
              size={20}
              color={isDark ? '#FCD34D' : '#818CF8'}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
};

const HEADER_HEIGHT = Platform.OS === 'ios' ? 56 : 62;

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomWidth: StyleSheet.hairlineWidth,
  },

  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    flex: 1,
    textAlign: 'center',
  },
});

export default AppHeader;

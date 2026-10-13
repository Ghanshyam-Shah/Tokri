{/* ═════════════════════════════════ App Header ═════════════════════════════════ */ }
// Toggle by default visible hota he
// "leftIcon" ke sath "onleftPress" dena jaruri he nhi to leftIcon visible nhi hoga
{/* ═════════════════════════════════ App Header ═════════════════════════════════ */ }

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';

import { DrawerActions, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme } from '../../../app/providers/ThemeProvider';

type MciName = React.ComponentProps<typeof Icon>['name'];
type IonName = React.ComponentProps<typeof Ionicons>['name'];

// Kaun si icon family use karni hai (default 'mci')
type IconSet = 'mci' | 'ionicons';

interface AppHeaderProps {
  title?: string;

  // Left button ka behaviour (default 'menu'):
  //   'menu' -> hamburger icon, drawer kholta hai
  //   'back' -> arrow icon, navigation.goBack()
  //   'none' -> left khali
  leftAction?: 'menu' | 'back' | 'none';

  // Optional overrides: custom icon/action chahiye to do.
  leftIcon?: string;
  leftIconSet?: IconSet; // default 'mci'
  onLeftPress?: () => void;

  // Right action button (jaise "+"): rightIcon + onRightPress dono doge tabhi dikhega
  rightIcon?: string;
  rightIconSet?: IconSet; // default 'mci'. Ionicons ka naam do to 'ionicons' likho
  onRightPress?: () => void;

  // Right action icon pe count badge. 0 ya undefined = badge nahi
  rightBadge?: number;

  // Theme toggle. Default true. Hatana ho to showThemeToggle={false}
  showThemeToggle?: boolean;
}

const HEADER_HEIGHT = Platform.OS === 'ios' ? 48 : 54;
const H_PADDING = 16;
const BTN_SIZE = 40;
// Left aur right dono slots ki same width, taaki title hamesha center me rahe.
const SIDE_SLOT_W = 88;
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

// ─────────────────────────────────────────────────────────────
// HeaderIconButton: spring animation + touchable (+ optional badge)
// ─────────────────────────────────────────────────────────────
interface HeaderIconButtonProps {
  icon: string;
  iconSet?: IconSet;
  onPress: () => void;
  size?: number;
  color: string;
  radius: number;
  badge?: number;
  badgeColor?: string;
}

const HeaderIconButton: React.FC<HeaderIconButtonProps> = ({
  icon,
  iconSet = 'mci',
  onPress,
  size = 24,
  color,
  radius,
  badge,
  badgeColor,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 0.78,
        useNativeDriver: true,
        speed: 60,
        bounciness: 4,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 25,
        bounciness: 10,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.75}
        hitSlop={HIT_SLOP}
        style={[styles.iconButton, { borderRadius: radius }]}
      >
        {iconSet === 'ionicons' ? (
          <Ionicons name={icon as IonName} size={size} color={color} />
        ) : (
          <Icon name={icon as MciName} size={size} color={color} />
        )}
        {badge !== undefined && badge > 0 && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeTxt}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────
// AppHeader
// ─────────────────────────────────────────────────────────────
const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'KiranaList',
  leftAction = 'menu',
  leftIcon,
  leftIconSet = 'mci',
  onLeftPress,
  rightIcon,
  rightIconSet = 'mci',
  onRightPress,
  rightBadge,
  showThemeToggle = true,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { colors, borderRadius, shadows, fontFamilies, typography } = theme;
  const navigation = useNavigation();

  // Left button resolve: override mila to wo, warna leftAction ke hisaab se default
  const resolvedLeftIcon: string | undefined =
    leftIcon ??
    (leftAction === 'menu'
      ? 'menu'
      : leftAction === 'back'
      ? 'arrow-left'
      : undefined);

  // Default icons MCI ke hain; override diya ho to uska set use hoga
  const resolvedLeftSet: IconSet = leftIcon ? leftIconSet : 'mci';

  const resolvedLeftPress: (() => void) | undefined =
    onLeftPress ??
    (leftAction === 'menu'
      ? () => navigation.dispatch(DrawerActions.openDrawer())
      : leftAction === 'back'
      ? () => navigation.goBack()
      : undefined);

  const hasLeft = !!resolvedLeftIcon && !!resolvedLeftPress;
  const hasAction = !!rightIcon && !!onRightPress;

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.appBackground,

          // ── Separator style: dono try karo, ek ko comment karke dusra chalao ──

          // OPTION 2: hairline border
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border, // <- apni theme ka border key lagana
        },
      ]}
    >
      {/* Left slot */}
      <View style={[styles.sideSlot, styles.leftSlot]}>
        {hasLeft && (
          <HeaderIconButton
            icon={resolvedLeftIcon!}
            iconSet={resolvedLeftSet}
            onPress={resolvedLeftPress!}
            size={28}
            color={colors.headerContent}
            radius={borderRadius.sm}
          />
        )}
      </View>

      {/* Title */}
      <Text
        numberOfLines={1}
        style={[
          styles.title,
          {
            color: colors.headerContent,
            fontFamily: fontFamilies.bold,
            fontSize: typography.lg,
          },
        ]}
      >
        {title}
      </Text>

      {/* Right slot: [action] [theme toggle] */}
      <View style={[styles.sideSlot, styles.rightSlot]}>
        {hasAction && (
          <HeaderIconButton
            icon={rightIcon!}
            iconSet={rightIconSet}
            onPress={onRightPress!}
            size={rightIconSet === 'ionicons' ? 24 : 26}
            color={colors.headerContent}
            radius={borderRadius.sm}
            badge={rightBadge}
            badgeColor={colors.primary} // <- apni theme me jo primary/accent key ho wo lagana
          />
        )}
        {showThemeToggle && (
          <HeaderIconButton
            icon={isDark ? 'white-balance-sunny' : 'weather-night'}
            onPress={toggleTheme}
            size={22}
            color={isDark ? '#FCD34D' : '#818CF8'}
            radius={borderRadius.sm}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PADDING,
    zIndex: 20, // collapsible bar (zIndex 10) ke upar rahe, taaki shadow dikhe
  },
  sideSlot: {
    width: SIDE_SLOT_W,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSlot: { justifyContent: 'flex-start' },
  rightSlot: { justifyContent: 'flex-end' },
  iconButton: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeTxt: { fontSize: 9, fontWeight: '800', color: '#fff' },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default React.memo(AppHeader);
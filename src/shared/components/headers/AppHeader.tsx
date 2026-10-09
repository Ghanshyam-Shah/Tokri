// import React, { useRef } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   Animated,
//   Platform,
// } from 'react-native';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { useTheme } from '../../../app/providers/ThemeProvider';

// interface AppHeaderProps {
//   title?: string;
//   leftIcon: React.ComponentProps<typeof Icon>['name'];
//   onLeftPress: () => void;
// }

// const HEADER_HEIGHT = Platform.OS === 'ios' ? 48 : 54;
// const H_PADDING = 16;

// const AppHeader: React.FC<AppHeaderProps> = ({
//   title = 'KiranaList',
//   leftIcon,
//   onLeftPress,
// }) => {
//   const { theme, isDark, toggleTheme } = useTheme();

//   const { colors, borderRadius, shadows, fontFamilies, typography } = theme;

//   const leftAnim = useRef(new Animated.Value(1)).current;
//   const themeAnim = useRef(new Animated.Value(1)).current;

//   const springPress = (anim: Animated.Value) => {
//     Animated.sequence([
//       Animated.spring(anim, {
//         toValue: 0.78,
//         useNativeDriver: true,
//         speed: 60,
//         bounciness: 4,
//       }),
//       Animated.spring(anim, {
//         toValue: 1,
//         useNativeDriver: true,
//         speed: 25,
//         bounciness: 10,
//       }),
//     ]).start();
//   };

//   const handleLeftPress = () => {
//     springPress(leftAnim);
//     onLeftPress();
//   };

//   const handleTheme = () => {
//     springPress(themeAnim);
//     toggleTheme();
//   };

//   return (
//     <>
//       <StatusBar
//         barStyle={isDark ? 'light-content' : 'dark-content'}
//         backgroundColor={colors.appBackground}
//         translucent={false}
//       />

//       <View
//         style={[
//           styles.header,
//           {
//             backgroundColor: colors.appBackground,
//             ...shadows.sm,
//           },
//         ]}
//       >
//         {/* Left Icon */}
//         <Animated.View
//           style={{
//             transform: [{ scale: leftAnim }],
//           }}
//         >
//           <TouchableOpacity
//             onPress={handleLeftPress}
//             activeOpacity={0.75}
//             hitSlop={{
//               top: 10,
//               bottom: 10,
//               left: 10,
//               right: 10,
//             }}
//             style={[
//               styles.iconButton,
//               {
//                 borderRadius: borderRadius.sm,
//               },
//             ]}
//           >
//             <Icon name={leftIcon} size={28} color={colors.headerContent} />
//           </TouchableOpacity>
//         </Animated.View>

//         {/* Title */}
//         <Text
//           numberOfLines={1}
//           style={[
//             styles.title,
//             {
//               color: colors.headerContent,
//               fontFamily: fontFamilies.bold,
//               fontSize: typography.lg,
//               letterSpacing: 0.3,
//             },
//           ]}
//         >
//           {title}
//         </Text>

//         {/* Theme Toggle */}
//         <Animated.View
//           style={{
//             transform: [{ scale: themeAnim }],
//           }}
//         >
//           <TouchableOpacity
//             onPress={handleTheme}
//             activeOpacity={0.75}
//             hitSlop={{
//               top: 10,
//               bottom: 10,
//               left: 10,
//               right: 10,
//             }}
//             style={[
//               styles.iconButton,
//               {
//                 borderRadius: borderRadius.sm,
//               },
//             ]}
//           >
//             <Icon
//               name={isDark ? 'white-balance-sunny' : 'weather-night'}
//               size={22}
//               color={isDark ? '#FCD34D' : '#818CF8'}
//             />
//           </TouchableOpacity>
//         </Animated.View>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     height: HEADER_HEIGHT,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: H_PADDING,
//   },

//   iconButton: {
//     width: 40,
//     height: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   title: {
//     flex: 1,
//     textAlign: 'center',
//     fontWeight: '700',
//   },
// });

// export default React.memo(AppHeader);



// ******************How to use 
// <AppHeader
//   title="Catalog"
//   leftIcon="menu"
//   onLeftPress={handleMenu}
//   rightIcon="plus-circle-outline"
//   onRightPress={handleAddProduct}
//   // showThemeToggle={false}   // theme toggle nahi chahiye to ye uncomment karo
// />

import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../app/providers/ThemeProvider';

type IconName = React.ComponentProps<typeof Icon>['name'];

interface AppHeaderProps {
  title?: string;

  // Left button: leftIcon + onLeftPress dono doge tabhi dikhega, warna left khali
  leftIcon?: IconName;
  onLeftPress?: () => void;

  // Right action button (jaise "+"): rightIcon + onRightPress dono doge tabhi dikhega
  rightIcon?: IconName;
  onRightPress?: () => void;

  // Theme toggle (🌙). Default true. Hatana ho to showThemeToggle={false}
  showThemeToggle?: boolean;
}

const HEADER_HEIGHT = Platform.OS === 'ios' ? 48 : 54;
const H_PADDING = 16;
const BTN_SIZE = 40;
// Left aur right dono slots ki same width (2 icons = 80px + thoda gap)
// Isse right me 0/1/2 icons ho, title hamesha exact center me rehta hai.
const SIDE_SLOT_W = 88;
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

// ─────────────────────────────────────────────────────────────
// HeaderIconButton: spring animation + touchable, ek jagah
// ─────────────────────────────────────────────────────────────
interface HeaderIconButtonProps {
  icon: IconName;
  onPress: () => void;
  size?: number;
  color: string;
  radius: number;
}

const HeaderIconButton: React.FC<HeaderIconButtonProps> = ({
  icon,
  onPress,
  size = 24,
  color,
  radius,
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
        <Icon name={icon} size={size} color={color} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────
// AppHeader
// ─────────────────────────────────────────────────────────────
const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'KiranaList',
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  showThemeToggle = true,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { colors, borderRadius, shadows, fontFamilies, typography } = theme;

  const hasLeft = !!leftIcon && !!onLeftPress;
  const hasAction = !!rightIcon && !!onRightPress;

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.appBackground,

          // ── Separator style: dono try karo, ek ko comment karke dusra chalao ──

          // OPTION 1: shadow
          ...shadows.sm,

          // OPTION 2: hairline border
          // borderBottomWidth: StyleSheet.hairlineWidth,
          // borderBottomColor: colors.border, // <- apni theme ka border key lagana
        },
      ]}
    >
      {/* Left slot */}
      <View style={[styles.sideSlot, styles.leftSlot]}>
        {hasLeft && (
          <HeaderIconButton
            icon={leftIcon!}
            onPress={onLeftPress!}
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
            onPress={onRightPress!}
            size={26}
            color={colors.headerContent}
            radius={borderRadius.sm}
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
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default React.memo(AppHeader);
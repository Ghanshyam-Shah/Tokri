// src/shared/components/sheets/BottomSheet.tsx
//
// Reusable bottom sheet (RN Modal + Animated, koi extra package nahi).
//
//  • Backdrop alag fade hota hai, sheet alag slide hoti hai (open aur close dono)
//  • Handle / header ko neeche kheench kar band kar sakte ho
//  • Safe-area ka asli bottom inset; keyboard aane par sheet upar uthti hai
//  • Height screen ke hisaab se limit (maxHeightRatio)
//  • `footer` slot sticky rehta hai (buttons hamesha dikhte hain)
//
// IMPORTANT: onClose me parent ko `visible` false karna hi hoga (backdrop tap,
// swipe-down, X, Android back — sab yahi call karte hain).
// onDismissed: close animation POORI hone ke baad call hota hai.
//
// Baad me chaho to is component ki jagah @gorhom/bottom-sheet laga sakte ho,
// props (visible / onClose / title / footer / children) wahi rakhna.

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardEvent,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { AppTheme } from '../../../theme/types/theme.types';

const OPEN_MS = 280;
const CLOSE_MS = 220;
const DISMISS_DISTANCE = 120; // itna neeche kheencho to band
const DISMISS_VELOCITY = 0.8; // ya itni tez swipe

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onDismissed?: () => void;

  title?: string;
  subtitle?: string;
  /** Header ke left me kuch (jaise back arrow) */
  headerLeft?: React.ReactNode;
  showClose?: boolean;

  /** Sticky footer (buttons) */
  footer?: React.ReactNode;
  /** true -> children ko ScrollView me daalo (chhota content / form ke liye) */
  scrollable?: boolean;
  /** Sheet ki max height, screen height ka hissa (0–1) */
  maxHeightRatio?: number;

  children?: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  onDismissed,
  title,
  subtitle,
  headerLeft,
  showClose = true,
  footer,
  scrollable = false,
  maxHeightRatio = 0.85,
  children,
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const { height: windowH } = useWindowDimensions();

  // Modal tab tak mounted rehta hai jab tak close animation khatam na ho
  const [mounted, setMounted] = useState(visible);
  const [kbHeight, setKbHeight] = useState(0);

  const translateY = useRef(new Animated.Value(windowH)).current;
  const kbOffset = useRef(new Animated.Value(0)).current;
  const mountedRef = useRef(visible);
  const closingRef = useRef(false);

  // latest callbacks (PanResponder / animation callbacks stale na hon)
  const onCloseRef = useRef(onClose);
  const onDismissedRef = useRef(onDismissed);
  onCloseRef.current = onClose;
  onDismissedRef.current = onDismissed;

  // ── Animations ──
  const animateIn = useCallback(() => {
    closingRef.current = false;
    translateY.stopAnimation();
    Animated.timing(translateY, {
      toValue: 0,
      duration: OPEN_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const animateOut = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    Keyboard.dismiss();

    Animated.timing(translateY, {
      toValue: windowH,
      duration: CLOSE_MS,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return; // beech me dobara khul gayi
      closingRef.current = false;
      mountedRef.current = false;
      kbOffset.setValue(0);
      setKbHeight(0);
      setMounted(false);
      onDismissedRef.current?.();
    });
  }, [translateY, kbOffset, windowH]);

  // visible badalne par: mount -> (onShow me) animate in | animate out -> unmount
  useEffect(() => {
    if (visible) {
      if (!mountedRef.current) {
        mountedRef.current = true;
        setMounted(true); // Modal dikhte hi onShow -> animateIn
      } else if (closingRef.current) {
        animateIn(); // close chal rahi thi, wapas upar le aao
      }
    } else if (mountedRef.current) {
      animateOut();
    }
  }, [visible, animateIn, animateOut]);

  // ── Keyboard: sheet upar uthao ──
  useEffect(() => {
    if (!mounted) return;

    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const move = (height: number, duration?: number) => {
      setKbHeight(height);
      Animated.timing(kbOffset, {
        toValue: height,
        duration: duration ?? 200,
        useNativeDriver: false,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvt, (e: KeyboardEvent) =>
      move(e.endCoordinates.height, e.duration),
    );
    const hideSub = Keyboard.addListener(hideEvt, (e: KeyboardEvent) =>
      move(0, e.duration),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [mounted, kbOffset]);

  // ── Swipe-down to dismiss (handle + header se) ──
  const springBack = useCallback(() => {
    Animated.spring(translateY, {
      toValue: 0,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // sirf neeche ki taraf ka vertical drag; taps (close button) free rehte hain
        onMoveShouldSetPanResponder: (_, g) =>
          g.dy > 4 && Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderTerminationRequest: () => false,
        onPanResponderMove: (_, g) => {
          translateY.setValue(Math.max(0, g.dy));
        },
        onPanResponderRelease: (_, g) => {
          if (g.dy > DISMISS_DISTANCE || g.vy > DISMISS_VELOCITY) {
            onCloseRef.current();
          } else {
            springBack();
          }
        },
        onPanResponderTerminate: springBack,
      }),
    [translateY, springBack],
  );

  // ── Derived values ──
  const backdropOpacity = translateY.interpolate({
    inputRange: [0, windowH],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const maxHeight = Math.min(
    windowH * maxHeightRatio,
    windowH - kbHeight - insets.top - spacing.md,
  );

  // keyboard khula ho to bottom inset ki zaroorat nahi
  const bottomPad =
    kbHeight > 0 ? spacing.lg : Math.max(insets.bottom, spacing.lg);

  const hasHeader = !!title || !!headerLeft || showClose;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
      onShow={animateIn}
    >
      <View style={styles.root}>
        {/* Backdrop: sirf fade hota hai */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            { opacity: backdropOpacity },
          ]}
        />
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close"
        />

        {/* Keyboard offset (JS-driven) + slide (native-driven): alag Views */}
        <Animated.View style={{ marginBottom: kbOffset }}>
          <Animated.View
            style={[
              styles.sheet,
              {
                maxHeight,
                paddingBottom: bottomPad,
                transform: [{ translateY }],
              },
            ]}
          >
            {/* Drag area: handle + header */}
            <View {...panResponder.panHandlers}>
              <View style={styles.handleWrap}>
                <View style={styles.handle} />
              </View>

              {hasHeader && (
                <View style={styles.header}>
                  {headerLeft}
                  <View style={styles.headerText}>
                    {!!title && (
                      <Text style={styles.title} numberOfLines={1}>
                        {title}
                      </Text>
                    )}
                    {!!subtitle && (
                      <Text style={styles.subtitle} numberOfLines={1}>
                        {subtitle}
                      </Text>
                    )}
                  </View>
                  {showClose && (
                    <Pressable
                      onPress={onClose}
                      style={styles.closeBtn}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel="Close"
                    >
                      <Icon name="close" size={18} color={colors.textPrimary} />
                    </Pressable>
                  )}
                </View>
              )}
            </View>

            {/* Body */}
            <View style={styles.body}>
              {scrollable ? (
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {children}
                </ScrollView>
              ) : (
                children
              )}
            </View>

            {/* Sticky footer */}
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: AppTheme) => {
  const { colors, spacing, borderRadius, shadows, typography, fontFamilies } =
    theme;

  return StyleSheet.create({
    root: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { backgroundColor: colors.overlay },

    sheet: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      // Top border + upar ki taraf shadow: light theme me bhi sheet alag dikhe
      borderTopWidth: 1,
      borderColor: colors.border,
      ...shadows.xl,
      shadowOffset: { width: 0, height: -6 },
    },

    handleWrap: {
      alignItems: 'center',
      paddingTop: spacing.sm + 2,
      paddingBottom: spacing.xs,
    },
    // border color nahi, textMuted (halka) — light theme me bhi dikhta hai
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textMuted,
      opacity: 0.4,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
    },
    headerText: { flex: 1 },
    title: {
      fontSize: typography.md,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: typography.xs,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      marginTop: 2,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.cardBgVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },

    body: {
      flexShrink: 1,
      paddingHorizontal: spacing.xl,
    },
    footer: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
  });
};

export default BottomSheet;
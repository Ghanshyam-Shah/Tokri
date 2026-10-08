// src/shared/components/layout/ScreenWrapper.tsx
//
// Poori app mein har screen ise wrap karegi.
// Yeh karta hai:
//   1. SafeAreaView  — notch / status bar se bachao
//   2. Background    — theme ka appBackground automatically
//   3. Scroll option — scrollable ya fixed layout dono support
//   4. Padding       — horizontal gutter theme se
//   5. KeyboardAvoidingView — forms mein keyboard overlap nahi hoga

import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  RefreshControl,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../app/providers/ThemeProvider';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ScreenWrapperProps {
  children: React.ReactNode;

  // Horizontal padding lagao ya nahi (default: true)
  // Search/Catalog jaise full-bleed screens ke liye false karo
  horizontalPadding?: boolean;

  // Scrollable screen chahiye? (default: false)
  // Form screens / long content ke liye true karo
  scrollable?: boolean;

  // Pull to refresh — sirf scrollable={true} ke saath kaam karta hai
  refreshing?: boolean;
  onRefresh?: () => void;

  // Extra style — screen-specific overrides ke liye
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;

  // Keyboard avoid — forms mein use karo (default: false)
  avoidKeyboard?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  horizontalPadding = true,
  scrollable = false,
  refreshing = false,
  onRefresh,
  style,
  contentStyle,
  avoidKeyboard = false,
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  // Horizontal padding: theme ka lg (16px) — design gutter
  const hPad = horizontalPadding ? spacing.lg : 0;

  // ── Inner content ──
  const innerContent = (
    <View style={[styles.inner, { paddingHorizontal: hPad }, contentStyle]}>
      {children}
    </View>
  );

  // ── Scrollable version ──
  const scrollContent = (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingHorizontal: hPad },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.headerContent} // spinner color = theme accent
            colors={[colors.headerContent]} // Android
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );

  // ── Keyboard avoiding wrapper ──
  const Wrapper = avoidKeyboard ? KeyboardAvoidingView : View;
  const wrapperProps = avoidKeyboard
    ? {
        behavior: Platform.OS === 'ios' ? ('padding' as const) : undefined,
        style: [styles.flex, { backgroundColor: colors.appBackground }, style],
      }
    : {
        style: [styles.flex, { backgroundColor: colors.appBackground }, style],
      };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.appBackground }]}
      edges={['bottom', 'left', 'right']} // top edge AppHeader handle karta hai
    >
      <Wrapper {...wrapperProps}>
        {scrollable ? scrollContent : innerContent}
      </Wrapper>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24, // bottom scroll padding — last item clip nahi hoga
  },
});

export default ScreenWrapper;

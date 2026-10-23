// src/features/auth/components/AuthScreen.tsx
//
// Saari auth screens ka common layout: safe area, keyboard handling, scroll,
// optional back button, aur neeche chipka hua footer.

import React, { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../app/providers/ThemeProvider';

type Theme = ReturnType<typeof useTheme>['theme'];

interface Props {
  children: React.ReactNode;
  footer?: React.ReactNode;
  showBack?: boolean;
}

const AuthScreen: React.FC<Props> = ({ children, footer, showBack = false }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const s = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.backRow}>
            {showBack && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={s.backBtn}
                accessibilityLabel="Go back"
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Icon name="arrow-left" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            )}
          </View>

          <View style={s.body}>{children}</View>

          {footer ? <View style={s.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme: Theme) => {
  const { colors, spacing } = theme;
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.appBackground },
    flex: { flex: 1 },
    content: {
      flexGrow: 1,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
    },
    backRow: { height: 52, justifyContent: 'center' },
    backBtn: {
      width: 44,
      height: 44,
      marginLeft: -10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: { flex: 1 },
    footer: { alignItems: 'center', paddingTop: spacing.lg },
  });
};

export default AuthScreen;

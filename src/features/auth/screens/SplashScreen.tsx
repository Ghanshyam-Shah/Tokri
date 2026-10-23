// src/features/auth/screens/SplashScreen.tsx
//
// Navigator ka hissa nahi hai. RootNavigator jab tak auth status 'loading' hai
// (restoreSession chal raha hai), ye screen seedha render karta hai.

import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../app/providers/ThemeProvider';
import AppLogo from '../components/AppLogo';

type Theme = ReturnType<typeof useTheme>['theme'];

const SplashScreen: React.FC = () => {
  const { theme } = useTheme();
  const s = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={s.root}>
      <AppLogo size={96} tagline="Your grocery list, all in one place" />
      <ActivityIndicator style={s.loader} color={theme.colors.primary} />
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.appBackground,
    },
    loader: { position: 'absolute', bottom: 64 },
  });

export default SplashScreen;

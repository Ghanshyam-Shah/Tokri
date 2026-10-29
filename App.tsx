
import React, { useEffect } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Platform } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/app/providers/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from './src/app/store/store';

const AppContent = () => {
  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.appBackground,
      card: colors.headerBackground,
      text: colors.textPrimary,
      border: colors.border,
      primary: colors.primary,
      notification: colors.primary,
    },
  };

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    SystemNavigationBar.setNavigationColor(
      colors.bottomTabBar,        // tab bar ke saath match
      isDark ? 'light' : 'dark',  // buttons/icons ka rang
      'navigation',
    );
  }, [colors.bottomTabBar, isDark]);

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.appBackground}
        translucent={false}
      />
      <RootNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView></Provider>
  );
}

import React from 'react';
import { View } from 'react-native';

import AppHeader from '../../../shared/components/headers/AppHeader';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

const HistoryScreen = () => {
  const { theme } = useTheme();

  const { colors } = theme;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.appBackground,
      }}
    >
      <AppHeader title="History" />
    </SafeAreaView>
  );
};

export default HistoryScreen;

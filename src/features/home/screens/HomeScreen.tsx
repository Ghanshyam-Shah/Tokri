import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// import AppHeader from '../../../shared/components/headers/AppHeader';

import { useTheme } from '../../../app/providers/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../../shared/components/headers/AppHeader';
import {
  HomeStackParamList,
  RootStackParamList,
} from '../../../navigation/types/navigationTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useNavigation } from '@react-navigation/native';

type NavProp = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

const HomeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavProp>();
  const { colors } = theme;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.appBackground,
        alignItems: 'center',
        // justifyContent: 'center',
      }}
    >
      <Text style={{ color: colors.textPrimary }}>Home</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttons: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    width: '90%',
    margin: 20,
    borderWidth: 1,
    borderColor: 'skyblue',
  },
});

export default HomeScreen;

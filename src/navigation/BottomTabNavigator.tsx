// src/navigation/BottomTabNavigator.tsx

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeStackNavigator from './stacks/HomeStackNavigator';
import ListStackNavigator from './stacks/ListStackNavigator';
import CatalogStackNavigator from './stacks/CatalogStackNavigator';
import HistoryStackNavigator from './stacks/HistoryStackNavigator';
import CreateStackNavigator from './stacks/CreateStackNavigator';

import { BottomTabParamList } from './types/navigationTypes';
import { useTheme } from '../app/providers/ThemeProvider';

type IonName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_BAR_H = Platform.OS === 'ios' ? 62 : 60; // bottom safe-area alag se judta hai
const FAB_SIZE = 40;

// Har tab ke liye icon (filled = active, outline = inactive)
const TAB_ICONS: Record<string, { active: IonName; inactive: IonName }> = {
  HomeTab: { active: 'home', inactive: 'home-outline' },
  ListTab: { active: 'receipt', inactive: 'receipt-outline' },
  CatalogTab: { active: 'grid', inactive: 'grid-outline' },
  HistoryTab: { active: 'time', inactive: 'time-outline' },
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// ─── Center FAB button ────────────────────────────────────────────────────────
const CustomAddButton = ({ onPress }: BottomTabBarButtonProps) => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.fabWrap}
    >
      <View
        style={[
          styles.fab,
          {
            backgroundColor: colors.bottomTabIconBg,
            shadowColor: colors.bottomTabIconBg,
          },
        ]}
      >
        <Ionicons name="add" size={28} color={colors.bottomTabBar} />
      </View>
    </TouchableOpacity>
  );
};

// ─── Navigator ────────────────────────────────────────────────────────────────
export default function BottomTabs() {
  const { theme } = useTheme();
  const { colors, fontFamilies, typography, shadows } = theme;
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,

        tabBarActiveTintColor: colors.bottomTabIconActive,
        tabBarInactiveTintColor: colors.bottomTabIcon,

        tabBarStyle: {
          // gesture-nav / notch wale phones ke liye bottom inset yahin judta hai
          height: TAB_BAR_H + insets.bottom,
          paddingBottom: (Platform.OS === 'ios' ? 8 : 6) + insets.bottom,
          backgroundColor: colors.bottomTabBar,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          ...shadows.md,
          shadowOffset: { width: 0, height: -2 }, // shadow upar ki taraf
        },

        tabBarLabelStyle: {
          fontSize: typography.xs - 1,
          fontFamily: fontFamilies.medium,
          marginTop: 2,
        },

        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          if (!icons) return null;
          return (
            <View
              style={[
                styles.iconPill,
                // Active tab ke peeche pill chahiye to ye line uncomment karo:
                // focused && { backgroundColor: colors.bottomTabIconBg },
              ]}
            >
              <Ionicons
                name={focused ? icons.active : icons.inactive}
                size={22}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Home' }}
      />

      <Tab.Screen
        name="ListTab"
        component={ListStackNavigator}
        options={{ tabBarLabel: 'List' }}
      />

      <Tab.Screen
        name="CreateTab"
        component={CreateStackNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: CustomAddButton,
        }}
      />

      <Tab.Screen
        name="CatalogTab"
        component={CatalogStackNavigator}
        options={{ tabBarLabel: 'Catalog' }}
      />

      <Tab.Screen
        name="HistoryTab"
        component={HistoryStackNavigator}
        options={{ tabBarLabel: 'History' }}
      />
    </Tab.Navigator>
  );
}

// ─── Styles (sirf layout, colors upar theme se aate hain) ─────────────────────
const styles = StyleSheet.create({
  fabWrap: {
    top: (TAB_BAR_H - FAB_SIZE) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconPill: {
    width: 52,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
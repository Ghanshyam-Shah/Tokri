// src/navigation/BottomTabNavigator.tsx

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// import HomeStackNavigator from './stacks/HomeStackNavigator';
// import ListStackNavigator from './stacks/ListStackNavigator';
// import CatalogStackNavigator from './stacks/CatalogStackNavigator';
// import HistoryStackNavigator from './stacks/HistoryStackNavigator';
// import CreateStackNavigator from './stacks/CreateStackNavigator';

// import { BottomTabParamList } from './types/navigationTypes';

import { BottomTabParamList } from '../../navigation/types/navigationTypes';
import HomeStackNavigator from '../../navigation/stacks/HomeStackNavigator';
import ListStackNavigator from '../../navigation/stacks/ListStackNavigator';
import CreateStackNavigator from '../../navigation/stacks/CreateStackNavigator';
import CatalogStackNavigator from '../../navigation/stacks/CatalogStackNavigator';
import HistoryStackNavigator from '../../navigation/stacks/HistoryStackNavigator';

// ─── Same DARK palette as CatalogScreen / NewListScreen ──────────────────────
const DARK = {
  bg: '#1c110b',
  surface: '#251913',
  border: '#3a2418',
  primary: '#a78b7d',
  textPrimary: '#f6ded3',
  textMuted: '#a78b7d',
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// ─── Center FAB button ────────────────────────────────────────────────────────
const CustomAddButton = ({ onPress }: any) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={styles.fabWrap}
  >
    <View style={styles.fab}>
      <Ionicons name="add" size={28} color="#fff" />
    </View>
  </TouchableOpacity>
);

// ─── Navigator ────────────────────────────────────────────────────────────────
export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,

        tabBarActiveTintColor: DARK.primary,
        tabBarInactiveTintColor: DARK.textMuted,

        tabBarStyle: {
          height: Platform.OS === 'ios' ? 60 : 58,
          backgroundColor: DARK.surface,
          borderTopWidth: 1,
          borderTopColor: DARK.border,
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          // paddingTop: 2,
          paddingBottom: Platform.OS === 'ios' ? 8 : 6,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 1,
        },

        tabBarIcon: ({ focused, color }) => {
          type IoniconsName =
            | 'home'
            | 'home-outline'
            | 'receipt'
            | 'receipt-outline'
            | 'grid'
            | 'grid-outline'
            | 'time'
            | 'time-outline'
            | 'ellipse';

          let iconName: IoniconsName = 'ellipse';

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ListTab':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'CatalogTab':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'HistoryTab':
              iconName = focused ? 'time' : 'time-outline';
              break;
          }

          return <Ionicons name={iconName} size={22} color={color} />;
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
          tabBarButton: props => <CustomAddButton {...props} />,
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  fabWrap: {
    // top: -16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 27,
    // borderWidth: 3,

    borderColor: DARK.surface,

    backgroundColor: DARK.primary,

    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DARK.primary,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
// </>

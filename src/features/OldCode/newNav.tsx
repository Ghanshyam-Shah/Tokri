// src/navigation/BottomTabNavigator.tsx

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomTabParamList } from '../../navigation/types/navigationTypes';
import HomeStackNavigator from '../../navigation/stacks/HomeStackNavigator';
import ListStackNavigator from '../../navigation/stacks/ListStackNavigator';
import CreateStackNavigator from '../../navigation/stacks/CreateStackNavigator';
import CatalogStackNavigator from '../../navigation/stacks/CatalogStackNavigator';
import HistoryStackNavigator from '../../navigation/stacks/HistoryStackNavigator';

// import HomeStackNavigator from './stacks/HomeStackNavigator';
// import ListStackNavigator from './stacks/ListStackNavigator';
// import CatalogStackNavigator from './stacks/CatalogStackNavigator';
// import HistoryStackNavigator from './stacks/HistoryStackNavigator';
// import CreateStackNavigator from './stacks/CreateStackNavigator';

// import { BottomTabParamList } from './types/navigationTypes';

const COLORS = {
  background: '#15100D',
  navbar: '#211713',
  active: '#E8B09A',
  inactive: '#806F67',
  activeBg: '#34231C',
  border: '#38251E',
  white: '#FFFFFF',
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// ─────────────────────────────────────────────────────────────
// Center Create Button
// ─────────────────────────────────────────────────────────────

const CustomAddButton = ({ onPress }: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.createButtonContainer}
    >
      <View style={styles.createButton}>
        <Ionicons name="add" size={30} color={COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────
// Custom Active Tab Icon
// ─────────────────────────────────────────────────────────────

const TabIcon = ({
  focused,
  color,
  icon,
}: {
  focused: boolean;
  color: string;
  icon: string;
}) => {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <Ionicons name={icon} size={21} color={color} />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// Bottom Tabs
// ─────────────────────────────────────────────────────────────

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: true,

        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,

        tabBarStyle: {
          position: 'absolute',

          left: 12,
          right: 12,
          bottom: Platform.OS === 'ios' ? 12 : 10,

          height: Platform.OS === 'ios' ? 70 : 66,

          backgroundColor: COLORS.navbar,

          borderWidth: 1,
          borderColor: COLORS.border,

          borderRadius: 22,

          elevation: 10,

          shadowColor: '#000',
          shadowOpacity: 0.35,
          shadowRadius: 12,
          shadowOffset: {
            width: 0,
            height: 5,
          },

          paddingHorizontal: 8,

          paddingBottom: Platform.OS === 'ios' ? 8 : 5,
          paddingTop: 5,
        },

        tabBarItemStyle: {
          flex: 1,
          borderRadius: 16,
          marginHorizontal: 2,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 1,
        },

        tabBarIcon: ({ focused, color }) => {
          let iconName = 'ellipse';

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

          return <TabIcon focused={focused} color={color} icon={iconName} />;
        },
      })}
    >
      {/* Home */}

      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
        }}
      />

      {/* List */}

      <Tab.Screen
        name="ListTab"
        component={ListStackNavigator}
        options={{
          tabBarLabel: 'List',
        }}
      />

      {/* Create */}

      <Tab.Screen
        name="CreateTab"
        component={CreateStackNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,

          tabBarButton: props => <CustomAddButton {...props} />,
        }}
      />

      {/* Catalog */}

      <Tab.Screen
        name="CatalogTab"
        component={CatalogStackNavigator
        }
        options={{
          tabBarLabel: 'Catalog',
        }}
      />

      {/* History */}

      <Tab.Screen
        name="HistoryTab"
        component={HistoryStackNavigator}
        options={{
          tabBarLabel: 'History',
        }}
      />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  iconContainer: {
    width: 42,
    height: 30,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 12,
  },

  activeIconContainer: {
    backgroundColor: COLORS.activeBg,
  },

  // ─────────────────────────────
  // Center + Button
  // ─────────────────────────────

  createButtonContainer: {
    width: 70,
    height: 66,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: -20,
  },

  createButton: {
    width: 56,
    height: 56,

    borderRadius: 28,

    backgroundColor: COLORS.active,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 4,
    borderColor: COLORS.navbar,

    elevation: 8,

    shadowColor: COLORS.active,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
});

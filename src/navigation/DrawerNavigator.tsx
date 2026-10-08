import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import BottomTabNavigator from './BottomTabNavigator';
import { DrawerParamList } from './types/navigationTypes';

const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <View>
          <Ionicons name="people-circle" size={60} color="#6C6" />
        </View>

        <Text style={styles.userName}>Welcome User!</Text>
        <Text style={styles.userEmail}>user@example.com</Text>
      </View>

      {/* Drawer Items */}
      <DrawerItemList {...props} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <AntDesign name="logout" size={22} color="#FF5252" />

        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#6C6',
        drawerInactiveTintColor: '#555',
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{
          drawerLabel: 'Home',

          drawerIcon: ({ color }) => (
            <AntDesign name="home" size={22} color={color} />
          ),
        }}
      />

      {/* Example Extra Screens */}

      {/* 
      <Drawer.Screen
        name="Help"
        component={PlaceholderScreen('🔔 Help')}
        options={{
          drawerLabel: 'Help',
          drawerIcon: ({ color }) => (
            <AntDesign name="questioncircleo" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={PlaceholderScreen('⚙️ Settings')}
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
      */}
    </Drawer.Navigator>
  );
};

// Inline placeholder for drawer screens
const PlaceholderScreen = (title: string) => () =>
  (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>{title}</Text>
    </View>
  );

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#f8f7ff',
    marginBottom: 10,
    alignItems: 'center',
  },

  avatarContainer: {
    marginBottom: 10,
  },

  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  userEmail: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  logoutText: {
    fontSize: 16,
    color: '#FF5252',
    marginLeft: 10,
  },

  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default DrawerNavigator;

import React, { useMemo } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import BottomTabNavigator from './BottomTabNavigator';
import Help from '../features/other/help/screens/Help';
import About from '../features/other/about/screens/About';
import { DrawerParamList } from './types/navigationTypes';
import { useTheme } from '../app/providers/ThemeProvider';

const Drawer = createDrawerNavigator<DrawerParamList>();

type Theme = ReturnType<typeof useTheme>['theme'];

// ─── Custom drawer content ────────────────────────────────────────────────────
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Kya aap logout karna chahte hain?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // TODO: auth state false karo (Context/Redux), tab RootNavigator
          // apne aap Auth stack dikha dega.
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <Ionicons name="people-circle" size={60} color={colors.primary} />
        <Text style={styles.userName}>Welcome User!</Text>
        <Text style={styles.userEmail}>user@example.com</Text>
      </View>

      {/* Drawer Items */}
      <DrawerItemList {...props} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <AntDesign name="logout" size={22} color={colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

// ─── Navigator ────────────────────────────────────────────────────────────────
const DrawerNavigator = () => {
  const { theme } = useTheme();
  const { colors, fontFamilies, typography } = theme;

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.headerContent,
        drawerActiveBackgroundColor: colors.primaryMuted, // primary 6-digit hex hona chahiye
        drawerInactiveTintColor: colors.textMuted,
        drawerLabelStyle: {
          fontFamily: fontFamilies.medium,
          fontSize: typography.sm,
        },
        drawerStyle: {
          backgroundColor: colors.appBackground,
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

      <Drawer.Screen
        name="Help"
        component={Help}
        options={{
          drawerLabel: 'Help',
          drawerIcon: ({ color }) => (
            <AntDesign name="questioncircleo" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="About"
        component={About}
        options={{
          drawerLabel: 'About',
          drawerIcon: ({ color }) => (
            <AntDesign name="infocirlceo" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// ─── Styles (theme se) ────────────────────────────────────────────────────────
const createStyles = (theme: Theme) => {
  const { colors, spacing, typography, fontFamilies } = theme;

  return StyleSheet.create({
    drawerHeader: {
      padding: spacing.xl,
      backgroundColor: colors.cardBgVariant,
      marginBottom: spacing.sm,
      alignItems: 'center',
    },
    userName: {
      fontSize: typography.lg,
      fontFamily: fontFamilies.bold,
      color: colors.textPrimary,
    },
    userEmail: {
      fontSize: typography.xs + 1,
      fontFamily: fontFamilies.regular,
      color: colors.textMuted,
      marginTop: 2,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      marginTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    logoutText: {
      fontSize: typography.md,
      fontFamily: fontFamilies.medium,
      color: colors.error,
      marginLeft: spacing.sm + 2,
    },
  });
};

export default DrawerNavigator;
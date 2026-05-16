// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import Ionicons from 'react-native-vector-icons/Ionicons';

// import CatalogStackNavigator from './stacks/CatalogStackNavigator';
// import HistoryStackNavigator from './stacks/HistoryStackNavigator';
// import HomeStackNavigator from './stacks/HomeStackNavigator';
// import ListStackNavigator from './stacks/ListStackNavigator';

// import { BottomTabParamList } from './types/navigationTypes';

// const Tab = createBottomTabNavigator<BottomTabParamList>();

// const BottomTabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,

//         tabBarActiveTintColor: '#6C63FF',
//         tabBarInactiveTintColor: '#999999',

//         tabBarStyle: {
//           backgroundColor: '#ffffff',
//           borderTopWidth: 1,
//           borderTopColor: '#f0f0f0',
//           height: 60,
//           paddingBottom: 5,
//           paddingTop: 5,
//         },

//         tabBarLabelStyle: {
//           fontSize: 12,
//         },

//       tabBarIcon: ({ focused, color, size }) => {
//   let iconName:
//     | 'home'
//     | 'home-outline'
//     | 'grid'
//     | 'grid-outline'
//     | 'cart'
//     | 'cart-outline'
//     | 'list'
//     | 'list-outline'
//     | 'ellipse' = 'home';

//   switch (route.name) {
//     case 'HomeTab':
//       iconName = focused ? 'home' : 'home-outline';
//       break;

//     case 'ListTab':
//       iconName = focused ? 'grid' : 'grid-outline';
//       break;

//     case 'CatalogTab':
//       iconName = focused ? 'cart' : 'cart-outline';
//       break;

//     case 'HistoryTab':
//       iconName = focused ? 'list' : 'list-outline';
//       break;

//     default:
//       iconName = 'ellipse';
//   }

//   return (
//     <Ionicons
//       name={iconName}
//       size={size ?? 24}
//       color={color}
//     />
//   );
// },
//       })}
//     >
//       <Tab.Screen
//         name="HomeTab"
//         component={HomeStackNavigator}
//         options={{
//           tabBarLabel: 'Home',
//         }}
//       />

//       <Tab.Screen
//         name="ListTab"
//         component={ListStackNavigator}
//         options={{
//           tabBarLabel: 'List',
//         }}
//       />

//       <Tab.Screen
//         name="CatalogTab"
//         component={CatalogStackNavigator}
//         options={{
//           tabBarLabel: 'Catalog',
//         }}
//       />

//       <Tab.Screen
//         name="HistoryTab"
//         component={HistoryStackNavigator}
//         options={{
//           tabBarLabel: 'History',
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default BottomTabNavigator;

// BottomTabs.tsx

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Feather from 'react-native-vector-icons/Feather';
import HomeStackNavigator from './stacks/HomeStackNavigator';
import ListStackNavigator from './stacks/ListStackNavigator';
import HistoryStackNavigator from './stacks/HistoryStackNavigator';
import CatalogStackNavigator from './stacks/CatalogStackNavigator';

const Tab = createBottomTabNavigator();

const AddScreen = () => (
  <View style={{ flex: 1, backgroundColor: '#cb26d1' }} />
);

const CustomAddButton = ({ onPress }: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.addButtonContainer}
    >
      <View style={styles.addButton}>
        <Ionicons name="add" size={30} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: true,

        tabBarActiveTintColor: '#1F6E43',
        tabBarInactiveTintColor: '#9CA3AF',

        tabBarStyle: {
          height: 80,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: {
            width: 0,
            height: -3,
          },
          paddingBottom: 10,
          paddingTop: 10,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName:
            | 'home'
            | 'home-outline'
            | 'receipt'
            | 'receipt-outline'
            | 'grid'
            | 'grid-outline'
            | 'time'
            | 'time-outline'
            | 'ellipse' = 'home';

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

            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
        }}
      />

      <Tab.Screen
        name="ListTab"
        component={ListStackNavigator}
        options={{
          tabBarLabel: 'List',
        }}
      />

      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          tabBarLabel: '',

          tabBarIcon: () => null,

          tabBarButton: props => <CustomAddButton {...props} />,
        }}
      />

      <Tab.Screen
        name="CatalogTab"
        component={CatalogStackNavigator}
        options={{
          tabBarLabel: 'Catalog',
        }}
      />

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

const styles = StyleSheet.create({
  addButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: '#1F6E43',

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#1F6E43',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 8,
  },
});

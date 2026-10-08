import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateStackParamList } from '../types/navigationTypes';
import NewListScreen from '../../features/create/screens/NewListScreen';
import CreateListScreen from '../../features/create/screens/CreateListScreen';
import List from '../../features/create/screens/List';

const Stack = createNativeStackNavigator<CreateStackParamList>();

export default function CreateStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NewListScreen" component={NewListScreen} />
      <Stack.Screen name="CreateListScreen" component={CreateListScreen} />
      <Stack.Screen name="List" component={List} />
    </Stack.Navigator>
  );
}

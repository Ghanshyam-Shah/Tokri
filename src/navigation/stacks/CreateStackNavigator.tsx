import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateStackParamList } from '../types/navigationTypes';
import NewListScreen from '../../features/create/screens/NewListScreen';

const Stack = createNativeStackNavigator<CreateStackParamList>();

export default function CreateStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NewListScreen" component={NewListScreen} />
    </Stack.Navigator>
  );
}

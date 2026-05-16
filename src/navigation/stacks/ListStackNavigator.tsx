import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListScreen from '../../features/list/screens/ListScreen';
import { ListStackParamList } from '../types/navigationTypes';


const Stack = createNativeStackNavigator<ListStackParamList>();

const ListStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListMain" component={ListScreen} />
    </Stack.Navigator>
  );
};

export default ListStackNavigator;

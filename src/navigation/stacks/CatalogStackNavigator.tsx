import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CatalogScreen from '../../features/catalog/screens/CatalogScreen';
import { CatalogStackParamList } from '../types/navigationTypes';

const Stack = createNativeStackNavigator<CatalogStackParamList>();

const CatalogStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CatalogMain" component={CatalogScreen} />
    </Stack.Navigator>
  );
};

export default CatalogStackNavigator;

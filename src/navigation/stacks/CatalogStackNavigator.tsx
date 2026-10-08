import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CatalogScreen from '../../features/catalog/screens/CatalogScreen';
import { CatalogStackParamList } from '../types/navigationTypes';
import AddItem from '../../features/catalog/screens/AddItem';
import EditItem from '../../features/catalog/screens/EditItem';
// import AddItem from '../../features/temscreens/AddItem';
// import EditItem from '../../features/temscreens/EditItem';

const Stack = createNativeStackNavigator<CatalogStackParamList>();

const CatalogStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CatalogMain" component={CatalogScreen} />
      <Stack.Screen name="AddItem" component={AddItem} />
      <Stack.Screen name="EditItem" component={EditItem} />
    </Stack.Navigator>
  );
};

export default CatalogStackNavigator;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../features/home/screens/HomeScreen';
import { HomeStackParamList } from '../types/navigationTypes';
// import TempList from '../../features/temscreens/TempList';
// import TempCreateListScreen from '../../features/temscreens/TempCreateListScreen';
// import TempCatalogScreen from '../../features/temscreens/TempCatalogScreen';
// import AddItem from '../../features/temscreens/AddItem';
// import EditItem from '../../features/temscreens/EditItem';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />

      {/* <Stack.Screen name="TempList" component={TempList} />
      <Stack.Screen
        name="TempCreateListScreen"
        component={TempCreateListScreen}
      /> */}
      {/* <Stack.Screen name="TempCatalogScreen" component={TempCatalogScreen} /> */}
      {/* <Stack.Screen name="AddItem" component={AddItem} />
      <Stack.Screen name="EditItem" component={EditItem} /> */}
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;

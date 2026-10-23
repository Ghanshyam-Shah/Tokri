import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';
import CreateListScreen from '../features/create/screens/CreateListScreen';
import List from '../features/create/screens/List';
import AddItem from '../features/catalog/screens/AddItem';
import EditItem from '../features/catalog/screens/EditItem';
import { AppStackParamList } from './types/navigationTypes';
import HistoryList from '../features/history/screens/HistoryList';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* Tabs wala hissa */}
    <Stack.Screen name="MainDrawer" component={DrawerNavigator} />

    {/* Ye sab tabs ke upar khulte hain, tab bar nahi dikhega */}
    <Stack.Screen name="CreateListScreen" component={CreateListScreen} />
    <Stack.Screen name="List" component={List} />
    <Stack.Screen name="AddItem" component={AddItem} />
    <Stack.Screen name="EditItem" component={EditItem} />
    <Stack.Screen name="HistoryList" component={HistoryList}/>
  </Stack.Navigator>
);

export default AppNavigator;
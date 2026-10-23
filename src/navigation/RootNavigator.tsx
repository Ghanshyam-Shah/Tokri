// src/navigation/RootNavigator.tsx
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { RootStackParamList } from './types/navigationTypes';
import { useAppDispatch, useAppSelector } from '../app/store/hooks'; 
import { restoreSession } from '../features/auth/store/authSlice';
import SplashScreen from '../features/auth/screens/SplashScreen';
// import TempList from "../features/temscreens/TempList";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(s => s.auth.status);

  // App khulte hi Keychain se saved login dhundo
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Jab tak pata nahi chalta (loading) splash dikhao
  if (status === 'loading') return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {status === 'signedIn' ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
      {/* iska bad me alag stack banana he */}
      {/* <Stack.Screen name="TempList" component={TempList} /> */}
    </Stack.Navigator>
  );
};

export default RootNavigator;

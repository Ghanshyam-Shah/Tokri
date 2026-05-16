import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";

import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import { RootStackParamList } from "./types/navigationTypes";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  // Baad mein Redux se aayega — abhi testing ke liye
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;

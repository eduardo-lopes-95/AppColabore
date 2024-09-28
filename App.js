// App.js

import React from 'react';
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { ProfileProvider } from './contexts/ProfileContext';
import AppDrawer from './navigation/AppDrawer';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <NativeBaseProvider>
        <NavigationContainer>
          <ProfileProvider>
            <AppDrawer />
          </ProfileProvider>
        </NavigationContainer>
      </NativeBaseProvider>
    </AuthProvider>
  );
}

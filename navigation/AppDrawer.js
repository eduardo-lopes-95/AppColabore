import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomDrawerContent from '../components/CustomDrawerContent';
import AppStack from './AppStack';
import { supabase } from '../configs/supabaseClient';
import Home from '../screens/Home';
import SignIn from '../screens/SignIn';
import LogIn from '../screens/LogIn';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="LogIn" component={LogIn} />
  </Stack.Navigator>
);

const AppDrawer = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      if (authListener && authListener.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="AppStack" component={AppStack} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;

import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';
import AppStack from './AppStack';
import { supabase } from '../configs/supabaseClient';

const Drawer = createDrawerNavigator();

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
    return <AppStack />;
  }

  return (
    <Drawer.Navigator
      initialRouteName="AppStack"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="AppStack" component={AppStack} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;

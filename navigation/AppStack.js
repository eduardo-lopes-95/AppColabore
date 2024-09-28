import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import Job from '../screens/Job';
import JobListing from '../screens/JobListing';
import Resume from '../screens/Resume';
import SignIn from '../screens/SignIn';
import LogIn from '../screens/LogIn';
import Onboarding from '../screens/Onboarding';
import Profile from '../screens/Profile';
import TaskManagement from '../screens/TaskManagement';
import PerformanceManagement from '../screens/PerformanceManagement';
import DigitalTimesheet from '../screens/DigitalTimesheet';
import LearningAndDevelopment from '../screens/LearningAndDevelopment';
import Communication from '../screens/Communication';
import Analitycs from '../screens/Analitycs';

const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Job" component={Job} />
    <Stack.Screen name="JobListing" component={JobListing} />
    <Stack.Screen name="Resume" component={Resume} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="LogIn" component={LogIn} />
    <Stack.Screen name="Onboarding" component={Onboarding} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="TaskManagement" component={TaskManagement} />
    <Stack.Screen name="PerformanceManagement" component={PerformanceManagement} />
    <Stack.Screen name="DigitalTimesheet" component={DigitalTimesheet} />
    <Stack.Screen name="LearningAndDevelopment" component={LearningAndDevelopment} />
    <Stack.Screen name="Communication" component={Communication} />
    <Stack.Screen name="Analitycs" component={Analitycs} />
  </Stack.Navigator>
);

export default AppStack;

import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RecentScreen from '../screens/view/chat/RecentScreen';
import ActiveScreen from '../screens/view/chat/ActiveScreen.tsx';
import CallsScreen from '../screens/view/chat/CallsScreen.tsx';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarIndicatorStyle: { backgroundColor: '#ff7f50' },
        tabBarLabelStyle: { fontSize: 14, textTransform: 'none' },
      }}
    >
      <Tab.Screen name="Recent" component={RecentScreen} />
      <Tab.Screen name="Active" component={ActiveScreen} />
      <Tab.Screen name="Calls" component={CallsScreen} />
    </Tab.Navigator>
  );
}

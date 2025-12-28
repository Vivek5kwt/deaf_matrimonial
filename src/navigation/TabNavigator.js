import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RecentChats from '../components/Chat/RecentChats';
import ActiveChats from '../components/Chat/ActiveChats';
import CallScreen from '../components/Chat/Calls';

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
      <Tab.Screen name="Recent" component={RecentChats} />
      <Tab.Screen name="Active" component={ActiveChats} />
      <Tab.Screen name="Calls" component={CallScreen} />
    </Tab.Navigator>
  );
}

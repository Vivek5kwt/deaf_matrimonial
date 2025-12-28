import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomHeader from '../../../components/BottomHeader';
import Screen26 from '../login/pages/home/home';
import Screen30 from '../login/pages/home/pages/Daily';
import Screen40 from '../../Inbox/Recived';
import Screen52 from '../settings/PhotoPrivacy';


const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBar: () => <BottomHeader />, // custom tab bar
      }}
    >
      <Tab.Screen name="Screen26" component={Screen26} />
      <Tab.Screen name="Screen30" component={Screen30} />
      <Tab.Screen name="Screen40" component={Screen40} />
      <Tab.Screen name="Screen52" component={Screen52} />
    </Tab.Navigator>
  );
};

export default MainTabs;

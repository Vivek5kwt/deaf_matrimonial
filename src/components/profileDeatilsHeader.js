import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
 import { useNavigationState } from '@react-navigation/native';

const ProfiledetailHeader = ({ navigation, profileCounts = {} }) => {
  const tabs = ['My Shortlisted', 'Block Listed', 'Profile Viewed By','I Visited Profile','My Mobile Number Viewed By'];
  const [selectedTab, setSelectedTab] = useState('');
  const scrollViewRef = useRef(null);

  const currentRoute = useNavigationState((state) => state.routes[state.index].name);

  useEffect(() => {
    console.log('Current Route:', currentRoute);
    const routeToTabMap = {
      Screen57: 'My Shortlisted',
      Screen58: 'Block Listed',
      Screen59: 'Profile Viewed By',
      Screen60: 'I Visited Profile',
      Screen61: 'My Mobile Number Viewed By',
      // Screen62: 'Photo Password Request',

    };

    const tabName = routeToTabMap[currentRoute];
    if (tabName) {
      setSelectedTab(tabName);

      // Scroll to the active tab
      const tabIndex = tabs.indexOf(tabName);
      if (tabIndex !== -1 && scrollViewRef.current) {
        const screenWidth = Dimensions.get('window').width;
        const scrollToX = Math.max(0, tabIndex * 160 - (screenWidth / 2 - 60));
        scrollViewRef.current.scrollTo({
          x: scrollToX,
          animated: true,
        });
      }
    }
  }, [currentRoute]);

  const handleTabPress = (tab, index) => {
    console.log('Tab Pressed:', tab);
    setSelectedTab(tab);

    if (scrollViewRef.current) {
      // Center the tapped tab
      const screenWidth = Dimensions.get('window').width;
      const scrollToX = Math.max(0, index * 160 - (screenWidth / 2 - 60));
      scrollViewRef.current.scrollTo({
        x: scrollToX,
        animated: true,
      });
    }

    const tabToRouteMap = {
      'My Shortlisted': 'Screen57',
      'Block Listed': 'Screen58',
      'Profile Viewed By': 'Screen59',
      'I Visited Profile': 'Screen60',
      'My Mobile Number Viewed By': 'Screen61',
      
    };

    const route = tabToRouteMap[tab];
    console.log('Navigating to:', route);
    if (route) navigation.navigate(route);
  };

  return (
    <View style={styles.headerContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tabButton}
            onPress={() => handleTabPress(tab, index)}
          >
            <View style={styles.tabContent}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.selectedTabText,
                ]}
              >
                {tab}
                {profileCounts[tab] !== undefined ? ` (${profileCounts[tab]})` : ''}
              </Text>
              {selectedTab === tab && <View style={styles.underline} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    elevation: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { height: 1, width: 0 },
    paddingTop: 20,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  tabButton: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 35,
  },
  tabText: {
    fontSize: 14,
    color: '#BFBFBF',
    fontFamily: 'Lexend-Medium',
  },
  selectedTabText: {
    color: '#000000',
  },
  underline: {
    position: 'absolute',
    bottom: 1,
    width: '100%',
    height: 3,
    backgroundColor: '#FF7E00',
  },
});

export default ProfiledetailHeader;

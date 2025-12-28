import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const InboxHeader = ({ navigation, profileCounts = {} }) => {
  const tabs = ['Inbox', 'Important', 'Sent'];
  const [selectedTab, setSelectedTab] = useState('');
  const scrollViewRef = useRef(null);

  const currentRoute = useNavigationState((state) => state.routes[state.index].name);

  useEffect(() => {
    // Map current route to tab names
    const routeToTabMap = {
      Screen40: 'Inbox',
      Screen42: 'Important',
      Screen43: 'Sent',
    };

    const tabName = routeToTabMap[currentRoute];
    if (tabName) {
      setSelectedTab(tabName);

      // Scroll to the active tab
      const tabIndex = tabs.indexOf(tabName);
      if (tabIndex !== -1 && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: Math.max(0, tabIndex * 120 - 80),
          animated: true,
        });
      }
    }
  }, [currentRoute]);

  const handleTabPress = (tab, index) => {
    setSelectedTab(tab);

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: Math.max(0, index * 120 - 150),
        animated: true,
      });
    }

    const tabToRouteMap = {
      'Inbox': 'Screen40',
      'Important': 'Screen42',
      'Sent': 'Screen43',
    };

    const route = tabToRouteMap[tab];
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
    paddingVertical: hp('1%'), // ~8px
    elevation: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { height: 1, width: 0 },
    paddingTop: hp('1.5%'), // ~20px
  },
  scrollViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'), // ~15px
  },
  tabButton: {
    paddingHorizontal: wp('5.5%'), // ~20px
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('5%'), // ~40px
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: hp('4.5%'), // ~35px
  },
  tabText: {
    fontSize: wp('3.8%'), // ~14px
    color: '#BFBFBF',
    fontFamily: 'Lexend-Medium',
  },
  selectedTabText: {
    color: '#000000',
  },
  underline: {
    position: 'absolute',
    bottom: hp('0.1%'),
    width: '100%',
    height: hp('0.4%'), // ~3px
    backgroundColor: '#FF7E00',
  },
});

export default InboxHeader;

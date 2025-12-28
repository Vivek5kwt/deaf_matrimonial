import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigationState, useFocusEffect } from '@react-navigation/native';
import { location, search1 } from '../utils/constants/icons/icon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const GlobalHeader = ({ navigation, profileCounts }) => {
  const tabs = ['Search', 'One Way matches', 'Two Way matches', 'Broader matches', 'Preferred Matches', 'Custom Matches'];
  const [selectedTab, setSelectedTab] = useState('');
  const scrollViewRef = useRef(null);

  // Get the current route name
  const currentRoute = useNavigationState((state) => state.routes[state.index].name);

  useEffect(() => {
    // Map current route to tab names
    const routeToTabMap = {
      Screen29: 'Search',
      Screen30: 'One Way matches',                                                                                                                                                    
      Screen27: 'Two Way matches',
      Screen39: 'Broader matches',
      Screen28: 'Preferred Matches',
      Screen37: 'Custom Matches',
      Screen38: 'Shortlisted',
      Screen36: 'I Visited profile',
    };

    // Set the selected tab based on the current route
    const tabName = routeToTabMap[currentRoute];
    if (tabName) {
      setSelectedTab(tabName);

      // Scroll to the active tab
      const tabIndex = tabs.indexOf(tabName);
      if (tabIndex !== -1 && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: tabIndex * 120 -80,
          animated: true,
        });
      }
    }
  }, [currentRoute]); // Trigger whenever the route changes

  const handleTabPress = (tab, index) => {
    setSelectedTab(tab);

    scrollViewRef.current.scrollTo({
      x: index * 120 - 150,
      animated: true,
    });

    // Navigate to the corresponding screen
    const tabToRouteMap = {
      Search: 'Screen29',
      'One Way matches': 'Screen30',
      'Two Way matches': 'Screen27',
      'Recently Viewed': 'Screen38',
      'Preferred Matches': 'Screen28',
      'Broader matches': 'Screen39',
      'Custom Matches': 'Screen37',
      'I Visited profile': 'Screen36',
      Shortlisted: 'Screen38',
      
    };

    navigation.navigate(tabToRouteMap[tab]);
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
              <View style={styles.iconAndText}>
                {(tab === 'Search' || tab === 'Near Me') && (
                  <Image
                    source={tab === 'Search' ? search1.Icon94 : location.Icon12}
                    style={[
                      styles.iconStyle,
                      selectedTab === tab && styles.selectedIconStyle,
                    ]}
                    resizeMode="contain"
                  />
                )}
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab && styles.selectedTabText,
                  ]}
                >
                  {tab}
                  {profileCounts?.[tab] !== undefined && tab !== 'Search' ? ` (${profileCounts[tab]})` : ''}
                  
                </Text>
              </View>
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
    paddingVertical: hp('1%'),       // Responsive vertical padding
    elevation: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { height: 1, width: 0 },
  },
  scrollViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),     // Responsive horizontal padding
  },
  tabButton: {
    paddingHorizontal: wp('5.5%'),   // Adjusted for consistent spacing
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('5%'),
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: hp('4.5%'),
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    width: wp('4%'),
    height: wp('4%'),
    marginRight: wp('0.5%'),
    tintColor: '#BFBFBF',
  },
  selectedIconStyle: {
    tintColor: '#000000',
  },
  tabText: {
    fontSize: wp('3.5%'),
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
    height: hp('0.4%'),              // Responsive underline height
    backgroundColor: '#FF7E00',
  },
});

export default GlobalHeader;

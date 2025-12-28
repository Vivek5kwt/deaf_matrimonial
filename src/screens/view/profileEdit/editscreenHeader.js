import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const SettingHeader = ({ navigation, profileCounts }) => {
  const tabs = ['About me', 'About Partner'];
  const [selectedTab, setSelectedTab] = useState('');
  const scrollViewRef = useRef(null);
  const currentRoute = useNavigationState((state) => state.routes[state.index].name);

  useEffect(() => {
    const routeToTabMap = {
      Screen67: 'About me',
      Screen70: 'About Partner',
  
    };

    const tabName = routeToTabMap[currentRoute];
    if (tabName) {
      setSelectedTab(tabName);

      // Scroll to the active tab
      const tabIndex = tabs.indexOf(tabName);
      if (tabIndex !== -1 && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: tabIndex * 120 - 80,
          animated: true,
        });
      }
    }
  }, [currentRoute]);

  const handleTabPress = (tab, index) => {
    setSelectedTab(tab);

    scrollViewRef.current.scrollTo({
      x: index * 120 - 150,
      animated: true,
    });

    // Map tabs to navigation routes
    const tabToRouteMap = {
      'About me': 'Screen67',
      'About Partner': 'Screen70',
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
    paddingVertical: hp('1%'),
    elevation: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { height: 1, width: 0 },
  },
  scrollViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'), // instead of 15
  },
  tabButton: {
    paddingHorizontal: wp('5.5%'), // instead of 20
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('5%'), // instead of 40
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: hp('4.5%'), // instead of 35
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    width: wp('4%'), // ~15px
    height: wp('4%'),
    marginRight: wp('0.5%'), // ~2px
    tintColor: '#BFBFBF',
  },
  selectedIconStyle: {
    tintColor: '#000000',
  },
  tabText: {
    fontSize: wp('3.5%'), // ~14px
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
    height: hp('0.4%'), // ~3px
    backgroundColor: '#FF7E00',
  },
});

export default SettingHeader;

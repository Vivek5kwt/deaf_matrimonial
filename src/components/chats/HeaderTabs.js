import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HeaderTabs = ({ activeTab, setActiveTab, activeCount }) => {
  const tabs = [
    { label: 'Recent', screen: 'Screen33' },
    { label: `Active ${activeCount > 0 ? `${activeCount}+` : ''}`, screen: 'Screen34' },
  ];

  const navigation = useNavigation();

  return (
    <View>
      <View style={styles.container}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.label}
            style={[styles.tab, activeTab === tab.label.split(' ')[0] && styles.activeTab]}
            onPress={() => {
              setActiveTab(tab.label.split(' ')[0]);
              navigation.navigate(tab.screen);
            }}
          >
            <Text
              style={[styles.tabText, activeTab === tab.label.split(' ')[0] && styles.activeTabText]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.divider} />
    </View>
  );
};
const styles = StyleSheet.create({
  divider: { height: 2, backgroundColor: '#0000001A', marginVertical: 0 },
  container: { flexDirection: 'row', paddingVertical: 20,backgroundColor:'white',paddingLeft:20,paddingTop:30 },
  tab: { paddingHorizontal: 23, paddingVertical: 4, borderWidth: 1.5, borderColor: '#ccc', borderRadius: 20, marginRight: 18 },
  activeTab: { backgroundColor: 'orange', borderColor: 'orange' },
  tabText: { fontSize: 14, color: '#555', fontFamily: 'Lexend-Regular' },
  activeTabText: { color: 'white', fontWeight: 'bold' },
});

export default HeaderTabs;

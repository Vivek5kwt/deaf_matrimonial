import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, StatusBar,Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileCard from '../login/pages/home/View/OnewayCard';
import GlobalHeader from '../../../components/Header';
import BottomHeader from '../../../components/BottomHeader';
import verificationstyles from '../../../styles/verification/verificationstyles';
const { width, height } = Dimensions.get('screen');

const API_BASE_URL = 'http://82.29.161.246:8002';

const WEB_IMAGE_BASE_URL = 'http://82.29.161.246:8001/my_photos';
const getProfileImageUrl = (photo1: string): string => {
  if (!photo1) return 'https://via.placeholder.com/100';

  // Web user image: just the filename
  if (!photo1.includes('/') && photo1.endsWith('.jpg')) {
    return `${WEB_IMAGE_BASE_URL}/${photo1}`;
  }

  // App user image: relative path
  return `${API_BASE_URL}/${photo1}`;
};
const Screen37 = ({ navigation }) => {
  const [customMatches, setCustomMatches] = useState([]);
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    const fetchCustomMatches = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          console.error('Token not found');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/customMatches`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          console.error('Failed to fetch custom matches');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setCustomMatches(data.matches || []);
      } catch (error) {
        console.error('Error fetching custom matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomMatches();
  }, []);

  const handleProfileButtonPress = (profile) => {
    console.log(`Button pressed for ${profile.firstname} ${profile.lastname}`);
  };

  const profileCounts = {
    'Custom Matches': customMatches.length,
  };

  return (
 
<View style={styles.container}>

<GlobalHeader navigation={navigation} profileCounts={profileCounts} />

{loading ? (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#FF7E00" />
    <Text style={styles.loaderText}>Loading custom matches...</Text>
    </View>
) : (
  <ScrollView style={{ marginBottom: height * 0.09 }}>
          {renderProfileList('CUSTOM MATCHES', customMatches, handleProfileButtonPress)}
          </ScrollView>
)}

<View style={verificationstyles.bottomHeaderContainer}>
  <BottomHeader />
</View>
</View>
);
};
const renderProfileList = (title, profiles, onPress) => (
  <View>
    <View style={styles.listContainer}>
      <Text style={styles.listTitle}>{title}</Text>
      {profiles.length > 0 ? (
       <FlatList
       data={profiles}
       numColumns={2}
       keyExtractor={(item, index) => item.index_id?.toString() || index.toString()}
       renderItem={({ item }) => (
         <View style={styles.cardWrapper}>
          <ProfileCard
  profile={{
    id: item.index_id || `temp-${Math.random()}`,
    name: `${item.firstname || 'Unknown'} ${item.lastname || ''}`,
    matri_id: item.matri_id,
    birthdate: item.birthdate,
    language: item?.mother_tongue_data?.mtongue_name || 'N/A',
    status: item.m_status,
    height: item.height || 'N/A',
    caste_data: item.caste_data?.caste_name || 'N/A',
    city: item.city_data?.city_name || item.state?.state_name || 'N/A',
    interest: item.message || false,
    reminder_received: item.reminder_received || false,
    image: getProfileImageUrl(item?.photo1),
  }}
  onButtonPress={() => onPress(item)}
/>

         </View>
       )}
       contentContainerStyle={{ marginHorizontal: "2%" }}
       showsVerticalScrollIndicator={false}
     />
     
      ) : (
        <Text style={styles.noProfilesText}>No Custom Matches Found</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: height * 0.02,
    color: '#555',
    fontFamily: 'Lexend-Medium',
    fontSize: width < 400 ? 14 : 16,
  },
  listContainer: {
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
  },
  listTitle: {
    fontSize: width < 400 ? 16 : 18,
    marginBottom: height * 0.01,
    fontFamily: 'Lexend-Medium',
    textAlign: 'left', // Changed from 'center' to 'left'
  },
  noProfilesText: {
    color: '#888',
    fontSize: width < 400 ? 14 : 16,
    fontFamily: 'Lexend-Medium',
    textAlign: 'center',
    marginTop: height * 0.03,
  },
  flatListContent: {
    paddingBottom: height * 0.02,
  },
  cardWrapper: {
    flex: 1,
    alignItems: 'center',
    maxWidth: '50%',
    padding: 5,

  },
});



export default Screen37;

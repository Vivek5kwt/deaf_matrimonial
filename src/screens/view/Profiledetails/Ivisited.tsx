import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList, Dimensions, ActivityIndicator, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfiledetailHeader from '../../../components/profileDeatilsHeader';
import ProfileCard from '../login/pages/home/View/OnewayCard';
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

const Screen60 = ({ navigation }) => {
  const [profileViews, setProfileViews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileViews = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          console.error('Token not found');
          setLoading(false);
          return;
        }
  
        const response = await fetch(`${API_BASE_URL}/api/getProfileViewsByMe`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) {
          console.error('Failed to fetch profile views');
          setLoading(false);
          return;
        }
  
        const data = await response.json();
        // ✅ Use the correct key from API response
        setProfileViews(data.visitedProfiles || []);
      } catch (error) {
        console.error('Error fetching profile views:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfileViews();
  }, []);
  

  const handleProfileButtonPress = (profile: any) => {
    console.log(`Button pressed for ${profile.viewed_user.email}`);
  };

  return (
    <View style={styles.containergrey}>

      <ProfiledetailHeader navigation={navigation} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF7E00" />
          <Text style={styles.loaderText}>Loading profile views...</Text>
        </View>
      ) : (
        <ScrollView style={{ marginBottom: 70 }}>
          {renderProfileList('Profiles Visited By Me', profileViews, handleProfileButtonPress)}
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
          keyExtractor={(item, index) => item.visitor?.index_id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>

              <ProfileCard
                profile={{
                  id: item.visited_profile?.index_id?.toString() || `temp-${Math.random()}`,
                  name: `${item.visited_profile?.firstname || 'Unknown'} ${item.visited?.lastname || ''}`,
                  matri_id: item.visited_profile?.matri_id,
                  birthdate: item.visited_profile?.birthdate,
                  language: item.visited_profile?.mother_tongue_data?.mtongue_name,
                  status: item.visited_profile?.m_status,
                  height: item.visited_profile?.height,
                  caste_data: item.visited_profile?.caste_data?.caste_name,
                  city: item.visited_profile?.city_data?.city_name || 'N/A',
                  interest: item.message || false,
                  reminder_received: item.reminder_received || false,
                  image: getProfileImageUrl(item.visited_profile?.photo1),
                }}
                onButtonPress={() => onPress(item.visited_profile)}
              />

            </View>

          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginHorizontal: "2%" }}
        />
      ) : (
        <Text style={styles.noProfilesText}>No Profiles Found</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  containergrey: {
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

  cardWrapper: {
    flex: 1,
    alignItems: 'center',
    maxWidth: '50%', // Ensure two cards fit side by side
    padding: 5,

  },
});

export default Screen60;
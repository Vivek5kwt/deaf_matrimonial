import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions, ScrollView, FlatList, ActivityIndicator, StatusBar
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

const Screen59 = ({ navigation }) => {
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

        const response = await fetch(`${API_BASE_URL}/api/whoViewedMyProfile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          console.error('Failed to fetch profile views');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setProfileViews(data.viewedProfile || []);
      } catch (error) {
        console.error('Error fetching profile views:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileViews();
  }, []);

  const handleProfileButtonPress = (profile) => {
    console.log(`Button pressed for ${profile.email}`);
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
          {renderProfileList('Users Who Viewed Your Profile', profileViews, handleProfileButtonPress)}
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
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>

              <ProfileCard
                profile={{
                  id: item.visitor?.index_id || `temp-${Math.random()}`,
                  name: `${item.visitor?.firstname || 'Unknown'} ${item.visitor?.lastname || ''}`,
                  matri_id: item.visitor?.matri_id,
                  birthdate: item.visitor?.birthdate,
                  language: item.visitor?.mother_tongue_data?.mtongue_name,
                  status: item.visitor?.m_status,
                  height: item.visitor?.height,
                  caste_data:item.visitor?.caste_data?.caste_name,
                  city: item.visitor?.city_data?.city_name,
                  interest: item.visitor?.message || false,
                  reminder_received: item.visitor?.reminder_received || false,
                  image: getProfileImageUrl(item.visitor?.photo1),
                }}
                onButtonPress={() => onPress(item.visitor)}
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

export default Screen59;

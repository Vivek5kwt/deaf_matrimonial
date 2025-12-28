import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList, Dimensions, ActivityIndicator, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfiledetailHeader from '../../../components/profileDeatilsHeader';
import ProfileCard from '../login/pages/home/View/OnewayCard';
import { getUserData } from '../../../utils/constants/storage';
import BottomHeader from '../../../components/BottomHeader';
import verificationstyles from '../../../styles/verification/verificationstyles';
import { getProfileImageUrl } from '../../../utils/constants/imageUrl';

const { width, height } = Dimensions.get('screen');


const API_BASE_URL = 'http://82.29.161.246:8002';



const Screen27 = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };

    const fetchFavorites = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          console.error('Token not found');
          setLoading(false);
          return;
        }
    
        const response = await fetch(`${API_BASE_URL}/api/favorites`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
    
        if (!response.ok) {
          console.error('Failed to fetch favorites');
          setLoading(false);
          return;
        }
    
        const responseData = await response.json();
        setFavorites(responseData.data || []); // Extract the data array
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchFavorites();
  }, []);

  const handleProfileButtonPress = (profile: any) => {
    console.log(`Button pressed for ${profile.favorite_user.firstname} ${profile.favorite_user.lastname}`);
  };

  const profileCounts = {
    'Favorites': favorites.length,
  };

  return (
    <View style={styles.containergrey}>

      <ProfiledetailHeader navigation={navigation} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF7E00" />
          <Text style={styles.loaderText}>Loading favorites...</Text>
        </View>
      ) : (
        <ScrollView style={{ marginBottom: 70 }}>
          {renderProfileList('Short Listed', favorites, handleProfileButtonPress)}
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
                  id: item?.favorite_user?.matri_id || `temp-${Math.random()}`, // ✅ keeping matri_id as id fallback
                  name: `${item?.favorite_user?.firstname || 'Unknown'} ${item?.favorite_user?.lastname || ''}`,
                  matri_id: item?.favorite_user?.matri_id,
                  birthdate: item?.favorite_user?.birthdate,
                  language: item?.favorite_user?.mother_tongue_data?.mtongue_name,
                  status: item?.favorite_user?.m_status,
                  height: item?.favorite_user?.height,
                  caste_data: item?.favorite_user?.caste_data?.caste_name,
                  city: item?.favorite_user?.city_data?.city_name || item?.favorite_user?.part_city_names?.name || 'N/A',
                  interest: item?.favorite_user?.message || false,
                  reminder_received: item?.favorite_user?.reminder_received || false,
                  image: getProfileImageUrl(item?.favorite_user?.photo1),
                }}
                onButtonPress={() => onPress(item.favorite_user)}
              />


            </View>

          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginHorizontal: 10 }}
        />
      ) : (
        <Text style={styles.noProfilesText}>No Favorites Found</Text>
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

export default Screen27;
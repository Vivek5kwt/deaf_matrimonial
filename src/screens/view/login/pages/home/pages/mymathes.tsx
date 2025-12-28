import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, StatusBar, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import verificationstyles from '../../../../../../styles/verification/verificationstyles';
import BottomHeader from '../../../../../../components/BottomHeader';
import { getUserData } from '../../../../../../utils/constants/storage';
import GlobalHeader from '../../../../../../components/Header';
import ProfileCard from '../View/OnewayCard';
import { getProfileImageUrl } from '../../../../../../utils/constants/imageUrl';
const { width, height } = Dimensions.get('screen');
const API_BASE_URL = 'http://82.29.161.246:8002';

const Screen28 = ({ navigation }) => {
  const [preferredMatches, setPreferredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };

    const fetchPreferredMatches = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          console.error('Token not found');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/preferredMatches`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          console.error('Failed to fetch preferred matches');
          setLoading(false);
          return;
        }
        const data = await response.json();
        setPreferredMatches(data.preferred_matches || []);

      } catch (error) {
        console.error('Error fetching preferred matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchPreferredMatches();
  }, []);

  const handleProfileButtonPress = (profile: any) => {
    console.log(`Button pressed for ${profile.firstname} ${profile.lastname}`);
  };

  const profileCounts = {
    'Preferred Matches': preferredMatches.length,
  };

  return (
    <View style={styles.container}>

      <GlobalHeader navigation={navigation} profileCounts={profileCounts} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF7E00" />
          <Text style={styles.loaderText}>Loading preferred matches...</Text>
        </View>
      ) : (
        <ScrollView style={{ marginBottom: height * 0.09 }}>
          {renderProfileList('PREFERRED MATCHES', preferredMatches, handleProfileButtonPress)}
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
          numColumns={profiles.length === 1 ? 1 : 2}
          keyExtractor={(item, index) => item.index_id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>

              <ProfileCard
                profile={{
                  id: item.index_id || `temp-${Math.random()}`,
                  name: `${item.firstname || 'Unknown'} ${item.lastname || ''}`,
                  matri_id: item.matri_id,
                  birthdate: item.birthdate,
                  gothra: item.gothra || 'N/A',
                  height: item.height || 'N/A',
                  language: item.m_tongue || 'N/A',
                  interest: item.message || false,
                  reminder_received: item.reminder_received || false,
                  city: item.state?.state_name || 'N/A',
                  image: getProfileImageUrl(item?.photo1),
                }}
                onButtonPress={() => onPress(item)}
              />
            </View>

          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginHorizontal: "2%" }}
        />
      ) : (
        <Text style={styles.noProfilesText}>No Preferred Matches Found</Text>
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
    maxWidth: '50%', // Ensure two cards fit side by side
    padding: 5,

  },
});


export default Screen28;

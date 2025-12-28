import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator,Dimensions ,StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileCard from '../login/pages/home/View/OnewayCard';
import BottomHeader from '../../../components/BottomHeader';
import verificationstyles from '../../../styles/verification/verificationstyles';
import ProfiledetailHeader from '../../../components/profileDeatilsHeader';
const { width, height } = Dimensions.get('screen');

const API_BASE_URL = 'http://82.29.161.246:8002';

const Screen61 = ({ navigation }) => {
  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWhoViewedMyMobile = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
          console.error('Token not found');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/whoViewedMyMobile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          console.error('Failed to fetch data');
          setLoading(false);
          return;
        }

        const data = await response.json();
        const validViewers = (data.viewers || []).filter(item => item.viewer_user !== null);
        setViewers(validViewers);
              } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWhoViewedMyMobile();
  }, []);

  const handleProfileButtonPress = (profile) => {
    console.log(`Button pressed for ${profile.firstname} ${profile.lastname}`);
  };

  const profileCounts = {
    'Who Viewed My Mobile': viewers.length,
  };

  return (
    <View style={styles.container}>
      <ProfiledetailHeader navigation={navigation} profileCounts={profileCounts} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF7E00" />
          <Text style={styles.loaderText}>Loading viewers...</Text>
        </View>
      ) : (
        <ScrollView style={{ marginBottom: 70 }}>
          {renderProfileList('Who Viewed My Mobile Number', viewers, handleProfileButtonPress)}
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
          keyExtractor={(item, index) => item.viewer_user.index_id?.toString() || index.toString()}
          renderItem={({ item }) => (
                          <View style={styles.cardWrapper}>
            
            <ProfileCard
              profile={{
                id: item.viewer_user.index_id || `temp-${Math.random()}`,
                name: `${item.viewer_user.firstname || 'Unknown'} ${item.viewer_user.lastname || ''}`,
                matri_id: item.viewer_user.matri_id,
                birthdate: item.viewer_user.birthdate,
                gothra: item.viewer_user.gothra || 'N/A',
                height: item.viewer_user.height || 'N/A',
                language: item.viewer_user.m_tongue || 'N/A',
                interest: item.viewer_user.message || false,
                reminder_received: item.viewer_user.reminder_received || false, 
               
                city: item.viewer_user.city || 'N/A',
                image: item.viewer_user.photo1
                  ? `${API_BASE_URL}/${item.viewer_user.photo1}`
                  : 'https://via.placeholder.com/100'
              }}
              onButtonPress={() => onPress(item.viewer_user)}
            />
                </View>

          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginHorizontal: "2%" }}
          />
      ) : (
        <Text style={styles.noProfilesText}>No Viewers Found</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
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

export default Screen61;

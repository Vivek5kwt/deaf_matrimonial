import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions, FlatList,
  ActivityIndicator, RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfiledetailHeader from '../../../components/profileDeatilsHeader';
import { getUserData } from '../../../utils/constants/storage';
import BottomHeader from '../../../components/BottomHeader';
import verificationstyles from '../../../styles/verification/verificationstyles';
import ProfileCard from '../login/pages/home/View/ProfileViewCard';
import Snackbar from 'react-native-snackbar';
import { getProfileImageUrl } from '../../../utils/constants/imageUrl';

const { width, height } = Dimensions.get('screen');
const API_BASE_URL = 'http://82.29.161.246:8002';

const Screen58 = ({ navigation }) => {
  const [blocklist, setBlocklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [unblockingId, setUnblockingId] = useState(null);

  const fetchBlocklist = async () => {
    try {
      console.log('Fetching blocklist...');
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        console.error('Token not found');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/blocklist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        console.error('Failed to fetch blocklist');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setBlocklist(data || []);
    } catch (error) {
      console.error('Error fetching blocklist:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };

    fetchUserData();
    fetchBlocklist();
  }, []);

  const handleUnblock = async (userId) => {
    try {
      setUnblockingId(userId);

      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        console.error('Token not found');
        setUnblockingId(null);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/unblock/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        Snackbar.show({
          text: 'User unblocked successfully',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#4CAF50',
        });

        setTimeout(() => {
          fetchBlocklist();
        }, 500);
      } else {
        Snackbar.show({
          text: 'Failed to unblock user',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#FF3B30',
        });
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      Snackbar.show({
        text: 'An error occurred',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#FF3B30',
      });
    } finally {
      setUnblockingId(null);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBlocklist();
  };

  const renderProfileCard = ({ item }) => {
    const profile = item?.blocked_user || {};
    const userId = profile?.index_id;

    return (
      <View style={styles.cardWrapper}>
   <ProfileCard
  profile={{
    id: userId || `temp-${Math.random()}`,
    name: `${profile?.firstname || 'Unknown'} ${profile?.lastname || ''}`,
    matri_id: profile?.matri_id,
    birthdate: profile?.birthdate,
    language: profile?.mother_tongue_data?.mtongue_name,
    status: profile?.m_status,
    height: profile?.height,
    caste_data: profile?.caste_data?.caste_name,
    city: profile?.city_data?.city_name || profile?.city || 'N/A',
    interest: profile?.message || false,
    reminder_received: profile?.reminder_received || false,
    image: getProfileImageUrl(profile?.photo1),
  }}
  onButtonPress={() => handleUnblock(userId)}
  buttonText="Unblock"
  buttonStyle={styles.unblockButton}
  buttonTextStyle={styles.unblockButtonText}
  showLoader={unblockingId === userId}
/>

      </View>
    );
  };

  return (
    <View style={styles.containergrey}>
      <ProfiledetailHeader navigation={navigation} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF7E00" />
          <Text style={styles.loaderText}>Loading blocklist...</Text>
        </View>
      ) : (
        <FlatList
          data={blocklist}
          numColumns={2}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderProfileCard}
          contentContainerStyle={{
            paddingHorizontal: width * 0.04,
            paddingBottom: 100,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FF7E00']}
              tintColor={'#FF7E00'}
            />
          }
          ListHeaderComponent={
            <Text style={styles.listTitle}>Blocked Users</Text>
          }
          ListEmptyComponent={
            <Text style={styles.noProfilesText}>No Blocked Users Found</Text>
          }
        />
      )}

      <View style={verificationstyles.bottomHeaderContainer}>
        <BottomHeader />
      </View>
    </View>
  );
};

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
  listTitle: {
    fontSize: width < 400 ? 16 : 18,
    marginVertical: height * 0.02,
    fontFamily: 'Lexend-Medium',
    textAlign: 'left',
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
    maxWidth: '50%',
    padding: 5,
  },
  unblockButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 5,
  },
  unblockButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Lexend-Medium',
  },
});

export default Screen58;

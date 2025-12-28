import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import SettingHeader from './settingsHeader';
import BottomHeader from '../../../components/BottomHeader';
import ProfileCard from '../login/pages/home/View/ProfileViewCard';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getProfileImageUrl } from '../../../utils/constants/imageUrl';

const API_BASE_URL = 'http://82.29.161.246:8002';

const Screen56 = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const showSnackbar = (message, isError = false) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: isError ? '#D32F2F' : '#388E3C',
      textColor: '#fff',
    });
  };

  const fetchBlockedUsers = async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('auth_token');
      if (!authToken) {
        showSnackbar('Auth token not found!', true);
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/blocklist`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setBlockedUsers(response.data || []);
    } catch (error) {
      showSnackbar(error?.response?.data?.message || 'Error fetching blocked users.', true);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    if (!userId.trim()) {
      showSnackbar('Please enter a valid Matri ID.', true);
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem('auth_token');
      if (!authToken) {
        showSnackbar('Authentication failed. Please login again.', true);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/block/${userId.trim()}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || 'Failed to block user');
      }

      showSnackbar('User blocked successfully!');
      setUserId('');
      fetchBlockedUsers();  // Refresh the block list
    } catch (error) {
      showSnackbar(error.message || 'Failed to block user.', true);
    }
  };



  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? hp('10%') : 0}
        style={{ flex: 1 }}
      >
        <SettingHeader navigation={navigation} profileCounts={{ blockedCount: blockedUsers.length }} />

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Matri ID"
            placeholderTextColor="#888"
            value={userId}
            onChangeText={setUserId}
          />
          <TouchableOpacity
            style={[styles.button, !userId && styles.buttonDisabled]}
            onPress={handleBlock}
            disabled={!userId}
          >
            <Text style={styles.buttonText}>Block</Text>
          </TouchableOpacity>
        </View>

        {/* Blocked Users List */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FF7E00" />
            <Text style={styles.loaderText}>Loading blocklist...</Text>
          </View>
        ) : blockedUsers.length > 0 ? (
          <FlatList
            data={blockedUsers}
            numColumns={2}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <ProfileCard
                  profile={{
                    id: item?.blocked_user?.index_id || `temp-${Math.random()}`,
                    name: `${item?.blocked_user?.firstname || 'Unknown'} ${item?.blocked_user?.lastname || ''}`,
                    matri_id: item?.blocked_user?.matri_id,
                    birthdate: item?.blocked_user?.birthdate,
                    language: item?.blocked_user?.mother_tongue_data?.mtongue_name,
                    status: item?.blocked_user?.m_status,
                    height: item?.blocked_user?.height || 'N/A',
                    caste_data: item?.blocked_user?.caste_data?.caste_name || 'N/A',
                    city: item?.blocked_user?.city_data?.city_name || item?.blocked_user?.state?.state_name || 'N/A',
                    interest: item?.blocked_user?.profile_text || false,
                    reminder_received: item?.blocked_user?.reminder_received || false,
                    image: getProfileImageUrl(item.blocked_user?.photo1),
                  }}
                />

              </View>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: wp('3%'), paddingBottom: hp('10%') }}
          />
        ) : (
          <Text style={styles.noProfilesText}>No Blocked Users Found</Text>
        )}

        <View style={styles.bottomHeaderContainer}>
          <BottomHeader />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: wp('4%'),
    marginVertical: hp('2%'),
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: wp('2%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    fontSize: wp('3.5%'),
    marginRight: wp('2%'),
    backgroundColor: '#f9f9f9',
    fontFamily: 'Lexend-Medium',
    color:("black"),
  },
  button: {
    backgroundColor: '#E63946',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontFamily: 'Lexend-Medium',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: hp('1.5%'),
    color: '#555',
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.5%'),
  },
  noProfilesText: {
    color: '#888',
    fontSize: wp('4%'),
    textAlign: 'center',
    marginTop: hp('3%'),
    fontFamily: 'Lexend-Medium',
  },
  bottomHeaderContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cardWrapper: {
    flex: 1,
    alignItems: 'center',
    maxWidth: '50%',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
  },
});

export default Screen56;

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { getAgeFromBirthdate } from '../../../../../../utils/constants/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import verificationstyles from '../../../../../../styles/verification/verificationstyles';
import { user1 } from '../../../../../../utils/constants/images/image';

const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/100';
const API_BASE_URL = 'http://82.29.161.246:8002';

const ProfileCard = ({ profile, onUnblockSuccess }) => {
  const navigation = useNavigation();
  const age = getAgeFromBirthdate(profile.birthdate);
  const [unblocking, setUnblocking] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);

  const handleProfileView = async () => {
    try {
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) {
            Snackbar.show({
                text: 'Authentication error. Please log in again.',
                backgroundColor: 'red',
            });
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/visit-profile`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ viewed_id: profile.matri_id }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error storing profile view:', errorData);
            Snackbar.show({
                text: errorData.message || 'Failed to record view.',
                backgroundColor: 'red'
            });
            return; // Don't navigate if API fails
        }

        console.log('Profile view recorded successfully');

        // Only navigate if API call succeeds
        navigation.navigate('Screen68', {
            matriId: profile.matri_id,
            // You might want to pass the entire profile if needed
            profileData: profile
        });

    } catch (error) {
        console.error('API error:', error);
        Snackbar.show({
            text: 'Network error. Please try again.',
            backgroundColor: 'red'
        });
    }
};

  const handleUnblock = async () => {
    setUnblocking(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        Snackbar.show({ text: 'Authentication error. Please log in again.', backgroundColor: 'red' });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/block/${profile.matri_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        Snackbar.show({ text: errorData?.message || 'Failed to unblock user', backgroundColor: 'red' });
        return;
      }

      onUnblockSuccess?.(profile.id);
      setShowUnblockModal(false);
      setTimeout(() => {
        Snackbar.show({ text: `${profile.name} has been unblocked successfully!`, backgroundColor: '#4CAF50' });
      }, 300);
    } catch (error) {
      Snackbar.show({ text: 'Something went wrong. Please try again.', backgroundColor: 'red' });
    } finally {
      setUnblocking(false);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={handleProfileView}>
      <Image
                    source={profile.image ? { uri: profile.image } :user1?.IMG34}
                    style={verificationstyles.matchesimage}
                    defaultSource={user1?.IMG34} // For iOS
                    onError={() => { }} // You can add error handling here if needed
                />
              <View style={styles.profileDetails}>
                          <Text style={styles.profileAge}>Matri Id {profile.matri_id || 'Unknown'}</Text>
                          {/* <Text style={styles.profileName}>{profile.name || 'Unknown'}</Text> */}
                          <Text style={styles.profileAge}>{age} year</Text>
                          <Text style={styles.profileInfo}>{profile.height || 'N/A'} ft, {profile.language || 'N/A'}</Text>
                          <Text style={styles.profileInfo}>{profile.caste_data || 'N/A'},{profile.city || 'N/A'}</Text>
                          <Text style={styles.profileInfo}>{profile.status || 'N/A'}</Text>
      
                      </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.unblockButton}
        onPress={() => setShowUnblockModal(true)}
        disabled={unblocking}
      >
        {unblocking ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.unblockButtonText}>Unblock</Text>}
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={showUnblockModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUnblockModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Unblock User</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to unblock {profile.name}?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowUnblockModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.unblockConfirmButton]}
                onPress={handleUnblock}
                disabled={unblocking}
              >
                {unblocking ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.modalButtonText}>Unblock</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('5%'),
    shadowColor: '#FF7E00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: wp('5%'),
    elevation: 5,
    borderWidth: 1,
    borderColor: 'green',
    paddingHorizontal: wp('2%'),
    margin: wp('2.5%'),
    width: '96%',
  },
  profileImage: {
    width: '100%',
    aspectRatio: 0.7,
    borderRadius: wp('4%'),
    maxHeight: hp('35%'),
  },
  profileDetails: {
    position: 'absolute',
    top: '46%',
    paddingHorizontal: wp('1.2%'),
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // ✅ semi-transparent dark background
    borderRadius: 8, // for a smoother look
    width:'100%',

  },
  profileName: {
    fontSize: wp('3.2%'),
    fontFamily: 'Lexend-Medium',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  profileAge: {
    fontSize: wp('3.2%'),
    fontFamily: 'Lexend-Medium',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  profileInfo: {
    fontSize: wp('3.2%'),
    fontFamily: 'Lexend-Medium',
    color: 'white',
    marginTop: hp('0.5%'),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  unblockButton: {
    backgroundColor: '#FF7E00',
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
    marginTop: hp('3.2%'),
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    marginBottom: hp('1.2%'),

  },
  unblockButtonText: {
    color: '#FFFFFF',
    fontSize: wp('3.5%'),
    fontFamily: 'Lexend-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    padding: wp('5%'),
    width: wp('80%'),
  },
  modalTitle: {
    fontSize: wp('5%'),
    fontFamily: 'Lexend-Medium',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: wp('4%'),
    marginBottom: hp('2%'),
    textAlign: 'center',
    fontFamily: 'Lexend-Regular',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: hp('1.2%'),
    borderRadius: wp('2%'),
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6B7280',
  },
  unblockConfirmButton: {
    backgroundColor: '#FF7E00',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.5%'),
  },
});

export default ProfileCard;

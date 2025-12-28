import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native';
import SettingHeader from './settingsHeader';
import { useNavigation } from "@react-navigation/native";
import { ICONN71 } from '../../../utils/constants/icons/icon';
import BottomHeader from '../../../components/BottomHeader';
import Snackbar from 'react-native-snackbar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Import tick icon
const TICK_ICON = require('../../../assets/icons/Ok.png');

// API Endpoint
const API_URL = 'http://82.29.161.246:8002/api/contactView';

// Function to get user data from AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserData = async () => {
  try {
    const matriId = await AsyncStorage.getItem('matri_id');
    const firstName = await AsyncStorage.getItem('firstName');
    const lastName = await AsyncStorage.getItem('lastName');
    const authToken = (await AsyncStorage.getItem('auth_token')) || null;
    const email = await AsyncStorage.getItem('email');
    const profilePicture = await AsyncStorage.getItem('profile_picture');
    const indexId = await AsyncStorage.getItem('index_id');

    const userData = { matriId, firstName, lastName, email, indexId, profilePicture, authToken };
    console.log("Retrieved User Data:", userData);
    
    return userData;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

const Screen53 = () => {
  const [currentStatus, setCurrentStatus] = useState('Show To Paid Members');
  const navigation = useNavigation();

  // Update Status Handler
  const handleStatusChange = (status: string) => {
    setCurrentStatus(status);
  };

  // API Call to Update Status
  const handleSave = async () => {
    const userData = await getUserData();
  
    if (!userData || !userData.authToken) {
      Snackbar.show({
        text: 'Failed to retrieve user data. Please login again.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('contact_view_security', currentStatus === 'Show To Paid Members' ? '1' : '0');
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userData.authToken}`,
          'Accept': 'application/json',
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Snackbar.show({
          text: data.message || 'Contact view privacy updated successfully.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'green',
          fontFamily: "Lexend-Medium"
        });
      } else {
        Snackbar.show({
          text: data.message || 'Failed to update contact view privacy.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
          fontFamily: "Lexend-Medium"
        });
      }
    } catch (error) {
      console.error("Error in API call:", error);
      Snackbar.show({
        text: 'An error occurred. Please try again later.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
        fontFamily: "Lexend-Medium"
      });
    }
  };
  
  

  const renderOptions = () => {
    const options = [
      { label: 'Show To Paid Members', key: 'Show To Paid Members' },
      { label: 'Show Accepted Members Only', key: 'Show Accepted Members Only' },
    ];

    return options.map((option) => (
      <TouchableOpacity
        key={option.key}
        style={[
          styles.optionButton,
          currentStatus === option.key && styles.selectedOption,
        ]}
        onPress={() => handleStatusChange(option.key)}
      >
        <Image source={ICONN71?.ICONN_71} style={styles.icon} />
        <Text style={styles.optionText}>{option.label}</Text>
        {currentStatus === option.key && (
          <Image source={TICK_ICON} style={styles.tickIcon} />
        )}
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SettingHeader navigation={navigation} profileCounts={{}} />
      <View style={{ padding: 20 }}>
        <Text style={styles.header}>Contact Show Setting</Text>
        <Text style={styles.subHeader}>
          Set privacy for your contact details.
        </Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Current Status:</Text>
          <View style={styles.currentStatusContainer}>
            <Image source={ICONN71?.ICONN_71} style={styles.statusIcon} />
            <Text style={styles.currentStatus}>{currentStatus}</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>{renderOptions()}</View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomHeaderContainer}>
        <BottomHeader />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bottomHeaderContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: wp('5.8%'),
    fontFamily: 'Lexend-Medium',
    marginBottom: hp('1.5%'),
    color: '#2C3E50',
  },
  subHeader: {
    fontSize: wp('4%'),
    color: '#666',
    marginBottom: hp('2.5%'),
    lineHeight: hp('3.2%'),
    fontFamily: 'Lexend-Medium',
  },
  statusContainer: {
    marginBottom: hp('2.5%'),
  },
  statusText: {
    fontSize: wp('4.5%'),
    fontFamily: 'Lexend-Medium',
    marginBottom: hp('0.8%'),
  },
  currentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: wp('5%'),
    height: hp('1.7%'),
    marginRight: wp('2.5%'),
  },
  currentStatus: {
    fontSize: wp('4%'),
    color: '#E67E22',
    fontFamily: 'Lexend-Medium',
  },
  optionsContainer: {
    marginBottom: hp('1.5%'),
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: hp('2%'),
    borderRadius: wp('2.2%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    borderColor: '#28a745',
  },
  icon: {
    width: wp('5%'),
    height: hp('1.7%'),
    marginRight: wp('3.5%'),
    marginTop: hp('0.7%'),
  },
  tickIcon: {
    width: wp('5%'),
    height: wp('5%'),
    marginLeft: 'auto',
    tintColor: '#28a745',
  },
  optionText: {
    fontSize: wp('4%'),
    color: '#2C3E50',
    fontFamily: 'Lexend-Medium',
  },
  saveButton: {
    backgroundColor: '#E67E22',
    paddingHorizontal: wp('20%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp('2.5%'),
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Medium',
  },
});

export default Screen53;

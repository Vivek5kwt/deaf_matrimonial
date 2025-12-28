import React, { useState ,useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import SettingHeader from './settingsHeader';
import { useNavigation } from "@react-navigation/native";
import { ICONN71, ICONN711 } from '../../../utils/constants/icons/icon';
import BottomHeader from '../../../components/BottomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Screen52 = () => {
  const [currentStatus, setCurrentStatus] = useState('Visible To Paid Members');
  const [photoPassword, setPhotoPassword] = useState('');
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();


const getUserData = async () => {
  try {
    const authToken = await AsyncStorage.getItem('auth_token');
    if (!authToken) {
      throw new Error("Token not found. Please log in again.");
    }
    console.log('Token fetched:', authToken);
    return { authToken };
  } catch (error) {
    console.error("Error retrieving user data:", error.message);
    Alert.alert('Error', error.message);
    return null;
  }
};
useEffect(() => {
    const checkToken = async () => {
      const data = await getUserData();
      if (data?.authToken) {
        console.log('Token exists:', data.authToken);
      } else {
        console.log('No token found');
      }
    };
    checkToken();
  }, []);
  
  
  const handleStatusChange = async (status: string) => {
    try {
      const { authToken } = await getUserData();
  
      const response = await fetch('http://82.29.161.246:8002/api/setphotoprivacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          photo_privacy: status === 'Hidden For All' ? 'hidden' :
                         status === 'Visible To Paid Members' ? 'paid_members' :
                         status === 'Visible To All Members' ? 'visible' : 'visible',
        }),
      });
  
      const result = await response.json();
      if (response.status === 200) {
        setCurrentStatus(status);
        Snackbar.show({
          text: result.message || 'Photo privacy updated successfully!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#4CAF50',
          fontFamily: 'Lexend-Medium',

        });
      } else {
        Snackbar.show({
          text: result.message || 'Failed to update photo privacy.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#E74C3C',
          fontFamily: 'Lexend-Medium',

        });
      }
    } catch (error) {
      console.error('Error setting photo privacy:', error);
      Snackbar.show({
        text: 'Something went wrong. Please try again.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#E74C3C',
        fontFamily: 'Lexend-Medium',

      });
    }
  };
  

  const handleSubmitPassword = async () => {
    try {
      const { authToken } = await getUserData();
  
      const response = await fetch('http://82.29.161.246:8002/api/setphotoprivacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          photo_privacy: 'password_protected',
          profile_image_password: photoPassword,
        }),
      });
  
      const result = await response.json();
      if (response.status === 200) {
        Snackbar.show({
          text: result.message || 'Password set successfully!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#4CAF50',
        });
        setShowPasswordBox(false);
        setPhotoPassword('');
      } else {
        Snackbar.show({
          text: result.message || 'Failed to set password.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#E74C3C',
        });
      }
    } catch (error) {
      console.error('Error setting photo password:', error);
      Snackbar.show({
        text: 'Something went wrong. Please try again.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#E74C3C',
        fontFamily: 'Lexend-Medium',

      });
    }
  };
  

  const profileCounts = {};

  const renderOptions = () => {
    const options = [];
    if (currentStatus !== 'Visible To Paid Members') {
      options.push(
        <TouchableOpacity key="Visible To Paid Members" style={styles.optionButton} onPress={() => handleStatusChange('Visible To Paid Members')}>
          <Image source={ICONN71?.ICONN_71} style={styles.icon} />
          <Text style={styles.optionText}>Visible To Paid Members</Text>
        </TouchableOpacity>
      );
    }
    if (currentStatus !== 'Visible To All Members') {
      options.push(
        <TouchableOpacity key="Visible To All Members" style={styles.optionButton} onPress={() => handleStatusChange('Visible To All Members')}>
          <Image source={ICONN71?.ICONN_71} style={styles.icon} />
          <Text style={styles.optionText}>Visible To All Members</Text>
        </TouchableOpacity>
      );
    }
    if (currentStatus !== 'Hidden For All') {
      options.push(
        <TouchableOpacity key="Hidden For All" style={styles.optionButton} onPress={() => handleStatusChange('Hidden For All')}>
          <Image source={ICONN711?.ICONN_711} style={styles.eyeIcon2} />
          <Text style={styles.optionText}>Hidden For All</Text>
        </TouchableOpacity>
      );
    }
    return options;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SettingHeader navigation={navigation} profileCounts={profileCounts} />
      <View style={{ padding: 20 }}>
        <Text style={styles.header}>Photo Privacy Setting</Text>
        <Text style={styles.subHeader}>You can set your photo privacy from here, so you can manage who can see your photos.</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Current Status:</Text>
          <View style={styles.currentStatusContainer}>
            <Image source={currentStatus === 'Hidden For All' ? ICONN711?.ICONN_711 : ICONN71?.ICONN_71} style={styles.statusIcon} />
            <Text style={styles.currentStatus}>{currentStatus}</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>{renderOptions()}</View>

        <TouchableOpacity style={styles.togglePasswordButton} onPress={() => setShowPasswordBox(!showPasswordBox)}>
          <Text style={styles.togglePasswordText}>Set Password to Protect Photo</Text>
        </TouchableOpacity>

        {showPasswordBox && (
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.input}
              placeholder="Set Photo Password"
              value={photoPassword}
              onChangeText={setPhotoPassword}
              secureTextEntry={!isPasswordVisible}
              keyboardType="numeric"
              placeholderTextColor="#6c757d"

            />
            <TouchableOpacity style={styles.eyeIconButton} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Image source={isPasswordVisible ? ICONN71?.ICONN_71 : ICONN711?.ICONN_711} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: photoPassword.length >= 4 ? '#E67E22' : '#ccc' }]}
              onPress={handleSubmitPassword}
              disabled={photoPassword.length < 4}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
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
    fontSize: wp('5.5%'),
    fontFamily: 'Lexend-Medium',
    marginBottom: hp('1.2%'),
    color: '#2C3E50',
  },
  subHeader: {
    fontSize: wp('4%'),
    color: '#666',
    marginBottom: hp('2.5%'),
    lineHeight: hp('3%'),
    fontFamily: 'Lexend-Medium',
  },
  statusContainer: {
    marginBottom: hp('2.5%'),
  },
  statusText: {
    fontSize: wp('4.5%'),
    fontFamily: 'Lexend-Medium',
    marginBottom: hp('1%'),
    color: '#666',

  },
  currentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  statusIcon: {
    width: wp('5%'),
    height: hp('1.6%'),
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
  icon: {
    width: wp('5%'),
    height: hp('1.7%'),
    marginRight: wp('3.5%'),
    marginTop: hp('0.7%'),
  },
  icon2: {
    width: wp('5%'),
    height: wp('5%'),
    marginRight: wp('3.5%'),
  },
  optionText: {
    fontSize: wp('4%'),
    color: '#2C3E50',
    fontFamily: 'Lexend-Medium',
  },
  togglePasswordButton: {},
  togglePasswordText: {
    color: '#E67E22',
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Medium',
  },
  passwordBox: {
    marginTop: hp('2.5%'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2.5%'),
    padding: wp('3.5%'),
    marginBottom: hp('1.5%'),
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Medium',
    color:"black"
  },
  eyeIconButton: {
    position: 'absolute',
    right: wp('3%'),
    top: hp('1.5%'),
  },
  eyeIcon: {
    width: wp('5%'),
    height: wp('5%'),
    marginTop: hp('0.5%'),
  },
  eyeIcon2: {
    width: wp('5%'),
    height: wp('5%'),
    marginRight: wp('5%'),
  },
  submitButton: {
    paddingHorizontal: wp('20%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp('2.5%'),
    backgroundColor: '#E67E22', // Assuming background was intended
  },
  submitText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Medium',
  },
});

export default Screen52;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import Snackbar from 'react-native-snackbar';
import SettingHeader from './settingsHeader';
import { useNavigation } from "@react-navigation/native";
import { ICONN71, ICONN711 } from '../../../utils/constants/icons/icon';
import BottomHeader from '../../../components/BottomHeader';
import { getUserData } from '../../../utils/constants/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Screen54 = (props: any) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const navigation = useNavigation();

  const isStrongPassword = (password: any) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSaveChanges = async () => {
    setErrorMessage('');
    setPasswordMismatch(false);

    if (!oldPassword || !newPassword || !confirmPassword) {
      Snackbar.show({ text: 'All fields are required!', backgroundColor: '#e74c3c', fontFamily: 'Lexend-Regular' });
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setErrorMessage('Password must be at least 8 characters with a mix of uppercase, lowercase, numbers, and special characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    try {
      const userData = await getUserData();
      if (!userData?.authToken) {
        Snackbar.show({ text: 'Authentication failed. Please login again.', backgroundColor: '#e74c3c', fontFamily: 'Lexend-Regular' });
        return;
      }

      const response = await fetch('http://82.29.161.246:8002/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.authToken}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Snackbar.show({ text: data.message || 'Password changed successfully!', backgroundColor: '#2ecc71', fontFamily: 'Lexend-Regular' });
      } else {
        if (data.message?.includes('Old password is incorrect')) {
          setPasswordMismatch(true);
        }
        Snackbar.show({ text: data.message || 'Failed to change password.', backgroundColor: '#e74c3c', fontFamily: 'Lexend-Regular' });
      }
    } catch (error) {
      console.error('Error:', error);
      Snackbar.show({ text: 'An unexpected error occurred.', backgroundColor: '#e74c3c', fontFamily: 'Lexend-Regular' });
    }
  };

  const isSaveButtonActive = oldPassword && newPassword && confirmPassword;

  const profileCounts = {};

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <SettingHeader navigation={navigation} profileCounts={profileCounts} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Change Password</Text>
          <Text style={styles.subHeader}>Have any privacy concern? You can easily change your account password from here.</Text>

          {/* Old Password Input */}
          <View style={[styles.shadowBox, styles.textviewinput]}>
            <TextInput
              style={styles.textinput}
              placeholder="Enter Old Password"
              placeholderTextColor="#6c757d"
              secureTextEntry={!showOldPassword}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowOldPassword(!showOldPassword)} 
              style={styles.eyeIconContainer}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <Image
                source={showOldPassword ? ICONN711.ICONN_711 : ICONN71.ICONN_71}
                style={showOldPassword ? styles.showPasswordIcon1 : styles.hidePasswordIcon1}
              />
            </TouchableOpacity>
          </View>

          {/* New Password Input */}
          <View style={[styles.shadowBox, styles.textviewinput]}>
            <TextInput
              style={styles.textinput}
              placeholder="Enter New Password"
              placeholderTextColor="#6c757d"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowNewPassword(!showNewPassword)} 
              style={styles.eyeIconContainer}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <Image
                source={showNewPassword ? ICONN711.ICONN_711 : ICONN71.ICONN_71}
                style={showNewPassword ? styles.showPasswordIcon1 : styles.hidePasswordIcon1}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={[styles.shadowBox, styles.textviewinput]}>
            <TextInput
              style={styles.textinput}
              placeholder="Confirm New Password"
              placeholderTextColor="#6c757d"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
              style={styles.eyeIconContainer}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <Image
                source={showConfirmPassword ? ICONN711.ICONN_711 : ICONN71.ICONN_71}
                style={showConfirmPassword ? styles.showPasswordIcon1 : styles.hidePasswordIcon1}
              />
            </TouchableOpacity>
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          
          {passwordMismatch && (
            <TouchableOpacity onPress={() => props.navigation.navigate('Screen47')}>
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: isSaveButtonActive ? '#E67E22' : '#d3d3d3' }]}
            onPress={handleSaveChanges}
            disabled={!isSaveButtonActive}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomHeaderContainer}>
        <BottomHeader />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: wp('5%'),
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: wp('6.5%'),
    fontFamily: 'Lexend-Medium',
    color: '#f57224',
    marginBottom: hp('1.5%'),
    textAlign: 'center',
  },
  subHeader: {
    fontSize: wp('3.5%'),
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: hp('2%'),
    fontFamily: 'Lexend-Medium',
  },
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#fff',
  },
  textviewinput: {
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
    height: hp('6.5%'),
    justifyContent: 'center',
  },
  textinput: {
    color: 'black',
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Regular',
    flex: 1,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: wp('4%'),
    padding: wp('2%'),
  },
  showPasswordIcon1: {
    width: wp('5%'),
    height: hp('2.5%'),
    tintColor: '#6c757d',
  },
  hidePasswordIcon1: {
    width: wp('4.6%'),
    height: hp('1.6%'),
    tintColor: '#6c757d',
  },
  saveButton: {
    paddingHorizontal: wp('20%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('4.5%'),
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp('2.5%'),
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: wp('3%'),
    fontFamily: 'Lexend-Medium',
  },
  errorText: {
    color: '#dc3545',
    fontSize: wp('3.5%'),
    fontFamily: 'Lexend-Medium',
    marginTop: hp('0.8%'),
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  forgotPasswordText: {
    color: '#FF7E00',
    fontSize: wp('3.5%'),
    fontFamily: 'Lexend-Medium',
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  bottomHeaderContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Screen54;
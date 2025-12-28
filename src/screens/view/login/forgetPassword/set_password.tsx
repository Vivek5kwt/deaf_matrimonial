import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { ICONN71,ICONN711 } from '../../../../utils/constants/icons/icon';

const Screen69 = (props: any) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  const isStrongPassword = (password: any) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSaveChanges = () => {
    setErrorMessage('');
  
    if (!isStrongPassword(newPassword)) {
      setErrorMessage('Password must be at least 8 characters with a mix of uppercase, lowercase, numbers, and special characters.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }
  
    // If all validations pass, navigate to Screen50
    navigation.navigate('Screen50');
  };
  
  
  const isSaveButtonActive = newPassword && confirmPassword;


  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Change Password</Text>
          <Text style={styles.subHeader}>Have any privacy concern? You can easily Set your account password from here.</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter New Password"
                placeholderTextColor="#6c757d"
              secureTextEntry={!showNewPassword}
              value={newPassword}

              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.iconContainer}>
              <Image source={showNewPassword ? ICONN71.ICONN_71 : ICONN711.ICONN_711} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
                placeholderTextColor="#6c757d"
              placeholder="Confirm New Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.iconContainer}>
              <Image source={showConfirmPassword ? ICONN71.ICONN_71 : ICONN711.ICONN_711} style={styles.icon} />
            </TouchableOpacity>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          </View>
          
          
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: isSaveButtonActive ? '#E67E22' : '#d3d3d3' }]}
            onPress={handleSaveChanges}
            disabled={!isSaveButtonActive}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

     


    </View>
  );

};

const styles = StyleSheet.create({

  icon: {
    width: wp('5%'),
    height: hp('1.7%'),
    marginTop: hp('0.5%'),
  },
  icon2: {
    width: wp('5%'),
    height: hp('2.5%'),
  },
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
  inputContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: hp('2%'),
  },
  input: {
    width: '100%',
    height: hp('6.5%'),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    fontSize: wp('4%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: wp('1%'),
    elevation: 2,
    fontFamily: 'Lexend-Regular',
    color:'black'
  },
  iconContainer: {
    position: 'absolute',
    right: wp('4%'),
    top: hp('1.5%'),
  },
  saveButton: {
    paddingHorizontal: wp('20%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('4.5%'),
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp('2.5%'),
    backgroundColor: '#FF7E00',
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
  },
  forgotPasswordText: {
    color: '#FF7E00',
    fontSize: wp('3.5%'),
    fontFamily: 'Lexend-Medium',
    marginLeft: wp('3%'),
  },
 
  
});

export default Screen69;

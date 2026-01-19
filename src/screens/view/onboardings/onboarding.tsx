import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Platform,
  TextInput,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';

// ✅ Lottie Safe Import
import LottieView from 'lottie-react-native';

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';

import { getFcmToken, initializeFCM } from '../../../utils/constants/notifications/notificationHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DM,
  Greentop,
  IMG_1,
  OrangeB,
  patte,
} from '../../../utils/constants/images/image';

import {
  emaillogo,
  phonelogo,
  applelogo,
  googlelogo,
} from '../../../utils/constants/icons/icon';

import styles from '../../../styles/onboadings/styles';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import localStyles from '../../../styles/onboadings/loginpages/localStyles';
import { storeUserData } from '../../../utils/constants/storage';

interface Screen2Props {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

// ✅ Safe JSON loader to prevent crashes if file path is wrong
const getLottieSource = () => {
  try {
    return require('../../../assets/animations/fulll.json');
  } catch (e) {
    console.error('❌ Lottie JSON not found or invalid path:', e);
    return null;
  }
};

const Screen2: React.FC<Screen2Props> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [mobileRegistered, setMobileRegistered] = useState(false);
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // ✅ stable refs
  const otpInputs = useMemo(() => Array(4).fill(null).map(() => React.createRef<TextInput>()), []);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);

  // ✅ Lottie safe
  const lottieSource = useMemo(() => getLottieSource(), []);

  const handleOtpChange = (text: string, index: number) => {
    const updatedOtp = [...otpDigits];
    updatedOtp[index] = text;
    setOtpDigits(updatedOtp);

    if (text && index < 3) {
      otpInputs[index + 1]?.current?.focus();
    }

    const fullOtp = updatedOtp.join('');
    setOtp(fullOtp);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeFCM();

        GoogleSignin.configure({
          webClientId: '744077823025-m8n02omtopu1ph2j34rnonqt7h845n6u.apps.googleusercontent.com',
          offlineAccess: true,
        });

        console.log("✅ Screen2 initialized successfully");
        console.log("✅ LottieView =", typeof LottieView === 'function' ? 'OK' : LottieView);
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (emailModalVisible) {
      const timer = setTimeout(() => {
        setEmailModalVisible(false);
        navigation.navigate('Screen4');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [emailModalVisible, navigation]);

  const checkEmailExists = async (emailCheck: string) => {
    try {
      const fcmToken = await getFcmToken();
      const response = await axios.post('http://82.29.161.246:8002/api/check-email', {
        email: emailCheck,
        device_token: fcmToken,
      });

      return response.data.exists;
    } catch (error) {
      console.error('Email check error:', error);
      return false;
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();

      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken || signInResult.idToken;

      if (!idToken) throw new Error('No ID token found');

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth(), googleCredential);
      const user = userCredential.user;

      await storeUserData({
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
      });

      const emailExists = await checkEmailExists(user.email || '');

      if (emailExists) {
        Snackbar.show({
          text: 'This Google account is already registered. Please login.',
          duration: 3000,
          backgroundColor: 'orange',
          textColor: 'white',
        });

        navigation.navigate('Screen3', { prefilledEmail: user.email });
      } else {
        Snackbar.show({
          text: 'Complete your registration',
          duration: 3000,
          backgroundColor: 'green',
          textColor: 'white',
        });

        navigation.navigate('Screen4', {
          googleUser: {
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            idToken: idToken,
          },
        });
      }
    } catch (error: any) {
      console.error('Google Login Error:', error);

      Snackbar.show({
        text: 'Google Sign-In failed. Please try again.',
        duration: 3000,
        backgroundColor: 'red',
        textColor: 'white',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    try {
      setShowMobileInput(false);
      setModalVisible(false);

      const emailExists = await checkEmailExists(email);

      if (emailExists) {
        Snackbar.show({
          text: 'This email is already registered. Please login.',
          duration: 3000,
          backgroundColor: 'orange',
          textColor: 'white',
        });
        navigation.navigate('Screen3');
      } else {
        await AsyncStorage.setItem('user_email', email);
        setEmailModalVisible(true);
      }
    } catch (e) {
      console.log("Email signup modal error:", e);
    }
  };

  const handleMobileSignUpClick = () => {
    setShowMobileInput(true);
  };

  const handleMobileSignUp = async () => {
    try {
      if (!mobileNumber || mobileNumber.length !== 10) {
        Snackbar.show({
          text: 'Please enter a valid 10-digit mobile number',
          duration: 3000,
          backgroundColor: 'red',
          textColor: 'white',
        });
        return;
      }

      setMobileLoading(true);

      const fcmToken = await getFcmToken();
      await AsyncStorage.setItem('mobile_number', mobileNumber);

      const response = await axios.post('http://82.29.161.246:8002/api/login-with-mobile', {
        mobile: mobileNumber,
        device_token: fcmToken,
      });

      if (response.data.message === 'OTP sent successfully') {
        setMobileRegistered(true);
        setOtpModalVisible(true);
        Snackbar.show({
          text: 'OTP sent to your mobile number',
          duration: 3000,
          backgroundColor: 'green',
          textColor: 'white',
        });
      }
    } catch (error: any) {
      console.error('Mobile login error:', error);

      if (error.response?.status === 404) {
        setMobileRegistered(false);
        Snackbar.show({
          text: 'This mobile number is not registered. Please register your profile.',
          duration: 3000,
          backgroundColor: 'orange',
          textColor: 'white',
        });
        setModalVisible(false);
        navigation.navigate('Screen4');
      } else {
        Snackbar.show({
          text: 'Failed to send OTP. Please try again.',
          duration: 3000,
          backgroundColor: 'red',
          textColor: 'white',
        });
      }
    } finally {
      setMobileLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      if (!otp || otp.length !== 4) {
        Snackbar.show({
          text: 'Please enter a valid 4-digit OTP',
          duration: 3000,
          backgroundColor: 'red',
          textColor: 'white',
        });
        return;
      }

      setOtpLoading(true);

      const fcmToken = await getFcmToken();

      const response = await axios.post('http://82.29.161.246:8002/api/verify-mobile-otp', {
        otp: otp,
        device_token: fcmToken,
      });

      if (response.data.message === 'OTP verified successfully.') {
        const userData = response.data.user;
        const token = response.data.token;

        const completeUserData = {
          indexId: userData.index_id,
          email: userData.email,
          matriId: userData.matri_id,
          firstName: userData.firstname,
          lastName: userData.lastname,
          profilePicture: userData.photo1
            ? `http://82.29.161.246:8002/${userData.photo1}`
            : null,
          token: token,
          mobileNumber: mobileNumber,
        };

        await storeUserData(completeUserData, token);

        Snackbar.show({
          text: `Welcome ${userData.firstname} ✨!`,
          duration: 3000,
          backgroundColor: 'green',
          textColor: 'white',
        });

        navigation.navigate('Screen26', { userData: completeUserData });
        setOtpModalVisible(false);
      }
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      Snackbar.show({
        text: 'Invalid OTP. Please try again.',
        duration: 3000,
        backgroundColor: 'red',
        textColor: 'white',
      });
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageView}>
        {/* ✅ SAFE LOTTIE VIEW */}
        {typeof LottieView === 'function' && lottieSource ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: hp('60%'),
              zIndex: 2,
            }}
          >
            <LottieView
              source={lottieSource}
              autoPlay
              loop
              style={{ flex: 1 }}
            />
          </View>
        ) : null}

        <Image source={IMG_1?.IMG1} resizeMode="stretch" style={styles.imageStyle11} />
        <Image source={patte?.IMG31} style={styles.coverImage} />
        <Image source={Greentop?.IMG2} resizeMode="stretch" style={styles.imageStyle1} />
        <Image source={DM?.IMG3} resizeMode="contain" style={styles.imageStyle2} />
        <Image source={OrangeB?.IMG4} resizeMode="stretch" style={styles.imageStyle3} />

        <View style={styles.onbordingpageViewText}>
          <Text style={styles.onbordingpageText}>New to Deaf Matrimonial?</Text>

          <TouchableOpacity style={styles.letsbegin} onPress={() => setModalVisible(true)}>
            <Text style={styles.onbordingpageText2}>Let's Begin</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountlogin} onPress={() => navigation.navigate('Screen3')}>
            <Text style={styles.onbordingpageText3}>Already have an account? Login</Text>
          </TouchableOpacity>

          {/* Signup Options Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              setShowMobileInput(false);
            }}
          >
            <View style={styles.bottomSheetContainer}>
              <View style={styles.bottomSheetContent}>
                {googleLoading || mobileLoading || emailLoading ? (
                  <View style={{ alignItems: 'center', paddingVertical: hp('3%') }}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={{ marginTop: hp('1%'), fontFamily: 'Lexend-Regular', fontSize: hp('2%') }}>
                      {mobileLoading
                        ? 'Checking mobile number...'
                        : emailLoading
                        ? 'Creating account...'
                        : 'Signing in with Google...'}
                    </Text>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity style={styles.emgaborder1} onPress={handleEmailSignUp}>
                      <Image source={emaillogo?.Icon1} resizeMode="contain" style={styles.logostyle1} />
                      <Text style={styles.modalText121}>Sign up with Email</Text>
                    </TouchableOpacity>

                    {!showMobileInput ? (
                      <TouchableOpacity style={styles.emgaborder1} onPress={handleMobileSignUpClick}>
                        <Image source={phonelogo?.Icon2} resizeMode="contain" style={styles.logostyle1} />
                        <Text style={styles.modalText121}>Sign up with Mobile</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={localStyles.mobileInputContainer}>
                        <TextInput
                          style={localStyles.mobileInput}
                          placeholder="Enter mobile number"
                          placeholderTextColor="#888"
                          keyboardType="phone-pad"
                          maxLength={10}
                          value={mobileNumber}
                          onChangeText={setMobileNumber}
                        />
                        <TouchableOpacity
                          style={localStyles.sendOtpButton}
                          onPress={handleMobileSignUp}
                          disabled={mobileLoading}
                        >
                          {mobileLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <Text style={localStyles.sendOtpText}>Send OTP</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}

                    <TouchableOpacity style={styles.emgaborder1} onPress={handleGoogleLogin} disabled={googleLoading}>
                      <Image source={googlelogo?.Icon3} resizeMode="contain" style={styles.logostyle1} />
                      <Text style={styles.modalText121}>Sign up with Google</Text>
                    </TouchableOpacity>

                    {Platform.OS === 'ios' && (
                      <TouchableOpacity style={styles.emgaborder1} disabled>
                        <Image source={applelogo?.Icon4} resizeMode="contain" style={styles.logostyle1} />
                        <Text style={styles.modalText121}>Sign up with Apple</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}

                <View style={styles.alreadyaccount}>
                  <Text style={styles.closeButton1st}>Already have an account?</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setShowMobileInput(false);
                      navigation.navigate('Screen3');
                    }}
                  >
                    <Text style={styles.closeButton1st1}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* OTP Verification Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={otpModalVisible}
            onRequestClose={() => setOtpModalVisible(false)}
          >
            <View style={styles.bottomSheetContainer}>
              <View style={styles.bottomSheetContent}>
                <Text style={localStyles.otpTitle}>Enter OTP</Text>
                <Text style={localStyles.otpSubtitle}>We've sent a 4-digit code to {mobileNumber}</Text>

                <View style={localStyles.otpBoxesContainer}>
                  {otpDigits.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={otpInputs[index]}
                      style={localStyles.otpBox}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
                          otpInputs[index - 1]?.current?.focus();
                        }
                      }}
                      autoFocus={index === 0}
                    />
                  ))}
                </View>

                <TouchableOpacity style={localStyles.verifyButton} onPress={verifyOtp} disabled={otpLoading}>
                  {otpLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={localStyles.verifyButtonText}>Verify OTP</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={localStyles.resendButton} onPress={handleMobileSignUp}>
                  <Text style={localStyles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Email Loading Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={emailModalVisible}
            onRequestClose={() => setEmailModalVisible(false)}
          >
            <View style={styles.loadingModalContainer}>
              <View style={styles.loadingModalContent}>
                <Image source={DM?.IMG3} resizeMode="contain" style={styles.loadingModalLogo} />
                <ActivityIndicator size="large" color="#000" style={styles.loadingSpinner} />
                <Text style={styles.loadingModalText}>Let's add your details</Text>
                <Text style={styles.loadingModalSubText}>While we find matches for you</Text>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
};

export default Screen2;

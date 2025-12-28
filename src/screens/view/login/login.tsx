import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  SafeAreaView,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import styles from '../../../styles/onboadings/styles';
import styles1 from '../../../styles/onboadings/loginpages/styles';
import {
  applelogo,
  googlelogo,
  arrow,
  tick1,
  ICONN711,
  ICONN71,
} from '../../../utils/constants/icons/icon';
import { storeUserData, removeUserData } from '../../../utils/constants/storage';
import { getFcmToken, initializeFCM } from '../../../utils/constants/notifications/notificationHandler';
import auth from '@react-native-firebase/auth';
import { GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { initFirebase } from '../../../config/firebaseConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Screen3 = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isValidEmail = (email: string) => email.trim().length > 0;

  const isLoginButtonActive = isValidEmail(email) && password.trim().length >= 6;
  

  useEffect(() => {
    const initialize = async () => {
      try {
        await initFirebase();
        await initializeFCM();
        GoogleSignin.configure({
          webClientId: '744077823025-m8n02omtopu1ph2j34rnonqt7h845n6u.apps.googleusercontent.com',
          offlineAccess: true,
        });
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    initialize();
  }, []);

  const handleGoogleLogin = async () => {
    console.log("📲 Google Login flow started...");
    try {
      setGoogleLoading(true);
      console.log("⏳ setGoogleLoading -> true");
  
      // ✅ Play Services Check
      console.log("🔍 Checking Play Services...");
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log("✅ Play Services available");
  
      // ✅ Sign out first (clear cache/session)
      console.log("🚪 Signing out previous Google session...");
      await GoogleSignin.signOut();
      console.log("✅ Previous Google session cleared");
  
      // ✅ Sign in
      console.log("👤 Signing in with Google...");
      const signInResult = await GoogleSignin.signIn();
      console.log("✅ Google Sign-In success, result:", JSON.stringify(signInResult, null, 2));
  
      // ✅ Extract ID Token
      let idToken = signInResult.data?.idToken || signInResult.idToken;
      console.log("📌 Extracted idToken:", idToken ? "FOUND ✅" : "NOT FOUND ❌");
      if (!idToken) throw new Error('No ID token found from Google Sign-In');
  
      // ✅ Firebase Credential
      console.log("🔑 Creating Firebase credential...");
      const credential = GoogleAuthProvider.credential(idToken);
  
      console.log("📡 Signing in with Firebase...");
      const userCredential = await signInWithCredential(auth(), credential);
      console.log("✅ Firebase Sign-In success:", JSON.stringify(userCredential.user, null, 2));
  
      const user = userCredential.user;
  
      // ✅ Get FCM Token
      console.log("📡 Fetching FCM Token...");
      const fcmToken = await getFcmToken();
      console.log("✅ Got FCM Token:", fcmToken);
  
      // ✅ Store email locally
      if (user.email) {
        console.log("💾 Storing user email in AsyncStorage:", user.email);
        await AsyncStorage.setItem('email', user.email);
      } else {
        console.log("⚠️ No email found in user object!");
      }
  
      // ✅ API Check
      console.log("🌐 Sending API request to check-email...");
      const checkResponse = await axios.post('http://82.29.161.246:8002/api/check-email', {
        email: user.email,
        device_token: fcmToken,
      });
  
      console.log("✅ API Response:", JSON.stringify(checkResponse.data, null, 2));
  
      if (checkResponse.data.exists) {
        const { index_id, token, user: apiUser } = checkResponse.data;
        console.log("📌 API User found:", JSON.stringify(apiUser, null, 2));
        console.log("✅ API Token:", token);
  
        await storeUserData(
          {
            matriId: apiUser.matri_id,
            firstName: apiUser.firstname,
            lastName: apiUser.lastname,
            email: apiUser.email,
            profilePicture: apiUser.photo1
              ? `http://82.29.161.246:8002/${apiUser.photo1}`
              : user.photoURL,
            indexId: index_id.toString(),
          },
          token
        );
        console.log("💾 User data stored successfully");
  
        Snackbar.show({
          text: `Welcome ${apiUser.firstname} ✨!`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'green',
        });
  
        console.log("➡️ Navigating to Screen26...");
        props.navigation.navigate('Screen26');
      } else {
        console.log("⚠️ API says user not registered, redirecting to Screen4");
        Snackbar.show({
          text: 'Need to register with this Google Id!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
        props.navigation.navigate('Screen4', { email: user.email });
      }
    } catch (error) {
      console.error('❌ Google Login Error:', error?.message || error);
      Snackbar.show({
        text: 'Google Sign-In failed. Try again!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } finally {
      setGoogleLoading(false);
      console.log("⏹️ setGoogleLoading -> false, Google Login flow ended.");
    }
  };
  

  const handleLogin = async () => {
    if (!isLoginButtonActive) return;
    setLoading(true);

    try {
      const fcmToken = await getFcmToken();
      const response = await axios.post('http://82.29.161.246:8002/api/login', {
        email,
        password: password,
        device_token: fcmToken,
      });

      if (response.status === 200) {
        const { user, token } = response.data;

        const userData = {
          indexId: user.index_id,
          email: user.email,
          matriId: user.matri_id,
          firstName: user.firstname,
          lastName: user.lastname,
          profilePicture: `http://82.29.161.246:8002/${user.photo1}`,
          token: token,
          gender: user.gender,
        };

        await storeUserData(userData, token);

        Snackbar.show({
          text: `Welcome ${user.firstname}✨!`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'green',
        });

        props.navigation.navigate('Screen26', { userData });
      }
    } catch (error) {
      console.error('Login Error:', error);
      Snackbar.show({
        text: 'Invalid credentials or network issue',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles1.screenContainer}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
          </TouchableOpacity>
          <Text style={styles.loginText}>Login To Your Account</Text>

          {/* Email */}
          <TouchableOpacity style={[styles.shadowBox, styles.textviewinput]}>
            <TextInput
              style={styles.textinput}
              placeholder="Email or Matri Id"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </TouchableOpacity>

          {/* Password */}
          <TouchableOpacity style={[styles.shadowBox, styles.textviewinput]}>
            <TextInput
              style={styles.textinput}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
            <Image
  source={showPassword ? ICONN711?.ICONN_711 : ICONN71?.ICONN_71}
  style={showPassword ? styles.showPasswordIcon1 : styles.hidePasswordIcon1}
/>

            </TouchableOpacity>
          </TouchableOpacity>

          {/* Remember Me */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('1.2%') }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => setIsChecked(!isChecked)}
                style={{
                  borderWidth: 1,
                  borderColor: '#000',
                  width: wp('5%'),
                  height: hp('2.2%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: wp('2.5%'),
                  borderRadius: wp('1.2%'),
                  marginTop: hp('2%'),
                  marginLeft: wp('2.5%'),

                }}
              >
                {isChecked && (
                  <Image
                    source={tick1?.Icon7}
                    style={{
                      tintColor: 'black',
                      height: hp('1.9%'),
                      width: wp('4.2%'),
                    }}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.textunderline2}>Keep me logged in</Text>
            </View>
            <TouchableOpacity onPress={() => props.navigation.navigate('Screen47')}>
              <Text style={styles.textunderline2}>Forgot Your Password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[
            styles.emgaborder122,
            {
              backgroundColor: isLoginButtonActive ? '#FF7E00' : '#ccc',
              height: hp('5.7%'),
            },
          ]}
          onPress={handleLogin}
          disabled={!isLoginButtonActive || loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalText11}>Login</Text>}
        </TouchableOpacity>

        {/* OR CONTINUE */}
        <View style={styles.Continueview}>
          <Text style={styles.Continue}>Or Continue With</Text>
        </View>

        {/* Google Sign-In */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: wp('3.7%') }}>
          <TouchableOpacity
            onPress={handleGoogleLogin}
            style={[styles.shadowBox, styles.emgaborder11]}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Image source={googlelogo?.Icon3} resizeMode="contain" style={styles.logostyle21} />
                <Text style={styles.modalTextt}>Google</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Apple Sign-In Placeholder */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity
            onPress={() => Snackbar.show({ text: 'Apple login coming soon', duration: Snackbar.LENGTH_SHORT })}
            style={[styles.shadowBox, styles.emgaborder112]}
          >
            <Image source={applelogo?.Icon4} resizeMode="contain" style={styles.logostyle1} />
          </TouchableOpacity>
        )}

        {/* Register Link */}
        <View style={{ alignItems: 'center', marginTop: hp('2%') }}>
          <TouchableOpacity
            onPress={async () => {
              await removeUserData();
              props.navigation.navigate('Screen4');
            }}
          >
            <Text style={styles.textunderline2}>Not a Member Yet? Register Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Screen3;

import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
  Easing,
  SafeAreaView,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import styles2 from '../../../../../styles/verification/verificationstyles';

import { arrow, copypen } from '../../../../../utils/constants/icons/icon';
import { getUserData } from '../../../../../utils/constants/storage';

const Screen12 = ({ navigation }) => {
  const [text, setText] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matriId, setMatriId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const maxWordLimit = 20000;
  const minWordsForButton = 2;

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();
  };

  const fetchMatriId = async () => {
    try {
      const userData = await getUserData();
      if (!userData || !userData.matriId) {
        Alert.alert('Error', 'Matri ID not found. Please restart the registration process.');
      } else {
        setMatriId(userData.matriId);
      }
    } catch (error) {
      console.error('Error fetching Matri ID:', error);
    }
  };

  useEffect(() => {
    fetchMatriId();
  }, []);

  const countWords = (input: any) => input.trim().split(/\s+/).filter(Boolean).length;

  const handleTextChange = (input: any) => {
    const wordCount = countWords(input);
    if (wordCount <= maxWordLimit) {
      setText(input);
    }
  };

  useEffect(() => {
    setIsButtonActive(countWords(text) >= minWordsForButton);
  }, [text]);

  const handleSubmit = async () => {
    if (!isButtonActive) {
      Alert.alert('Error', 'Please write at least 5 words.');
      return;
    }
    if (!matriId) {
      Alert.alert('Error', 'Matri ID is missing. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://82.29.161.246:8002/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matri_id: matriId,
          profile_text: text,
        }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        Snackbar.show({
          text: '🎉 Profile created successfully!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#4CAF50',
        });

        await AsyncStorage.setItem('profile_text', text);
        setShowSuccessModal(true);
        startAnimation();

        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.navigate('Screen3');
        }, 4500);
      } else {
        Alert.alert('Error', result.message || 'Something went wrong!');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to submit data. Please try again.');
    }
  };

  const scale = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1.2, 1],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 1],
  });

  return (
    <SafeAreaView style={styles.container}>

      <View style={{ marginHorizontal: wp('5%')}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: wp('30%'),
            marginHorizontal: wp('30%'),
            paddingVertical: hp('2.5%'),
            paddingHorizontal: wp('10%'),
            backgroundColor: '#FDF1E3',
            borderColor: '#FDF1E3',
          }}
        >
          <Image source={copypen?.Icon17} resizeMode="stretch" style={styles1.userinfoimage} />
        </TouchableOpacity>

        <Text style={styles.blackVi}>We have added a short description</Text>
        <Text style={styles.blackVii}>about you</Text>
      </View>

      <View style={{ marginTop: hp('6%'), marginHorizontal: wp('5%') }}>
        <Text style={styles1.textt}>About Yourself</Text>

        <View style={[styles2.viewtextinputt, { position: 'relative' }]}>
          <TextInput
            style={[
              styles1.lightcolor,
              {
                height: hp('15%'),
                textAlignVertical: 'top',
                paddingRight: wp('6%'),
                color: 'black',
                fontSize: wp('4%'),
                marginLeft: wp('1%'),
            },
            ]}
            multiline
            value={text}
            onChangeText={handleTextChange}
            placeholder="Write something about yourself..."
            placeholderTextColor="#888"
          />
          <Text
            style={{
              position: 'absolute',
              right: wp('3%'),
              bottom: hp('-3%'),
              fontSize: wp('3%'),
              color: '#888',
            }}
          >
            {`${countWords(text)}/${maxWordLimit}`}
          </Text>
        </View>

        <Text style={styles1.lightcolor}>Edit the text above to make it</Text>
        <Text style={styles1.lightcolor}>more personal.</Text>

        <TouchableOpacity
          style={[
            styles2.cprofileV,
            {
              backgroundColor: isButtonActive ? '#FF7E00' : '#ccc',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: hp('5%'),
              borderRadius: wp('6%'),
              marginTop: hp('3%'),
            },
          ]}
          onPress={handleSubmit}
          disabled={!isButtonActive || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.modalText11}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Animated.View
            style={{
              backgroundColor: 'white',
              padding: wp('5%'),
              borderRadius: wp('5%'),
              width: wp('80%'),
              alignItems: 'center',
              transform: [{ scale }],
              opacity,
            }}
          >
            <LottieView
              source={require('../../../../../assets/animations/sucsess.json')}
              autoPlay
              loop={false}
              style={{ width: wp('35%'), height: wp('35%') }}
            />
            <Text
              style={{
                fontSize: wp('5%'),
                fontFamily: 'Lexend-Medium',
                marginBottom: hp('1%'),
                textAlign: 'center',
                color: '#4CAF50',
              }}
            >
              Account Created Successfully!
            </Text>
            <Text
              style={{
                fontSize: wp('4%'),
                textAlign: 'center',
                marginBottom: hp('2%'),
                color: '#555',
                fontFamily: 'Lexend-Regular',
              }}
            >
              Your account has been created.Please Login & Enjoy all features.
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Screen12;

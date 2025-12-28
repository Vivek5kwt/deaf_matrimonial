
import React, { useState, useEffect } from 'react';
import { View, StatusBar, TouchableOpacity, SafeAreaView,Image, Text, Alert, ActivityIndicator } from 'react-native';
import { arrow, user, tick1 } from '../../../../utils/constants/icons/icon';
import styles from '../../../../styles/onboadings/styles';
import styles1 from '../../../../styles/onboadings/loginpages/styles';
import { storeUserData } from '../../../../utils/constants/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Screen4 = (props: any) => {
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true); 
  const [showNextButton, setShowNextButton] = useState<boolean>(false); 
  const [loading, setLoading] = useState<boolean>(false);
  const options = [
    { label: 'Self', rightText: 'Parents' },
    { label: 'Relatives', rightText: 'Guardian' },
    { label: 'Sibling', rightText: 'Friends' },
  ];

  const genderOptions = [{ label: 'Male', rightText: 'Female' }];

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      if (isFirstTime) {
        setShowNextButton(false);
      } else {
        setShowNextButton(true);
      }
    });

    return unsubscribe;
  }, [props.navigation, isFirstTime]);

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    setShowNextButton(true);
  };

  const handleNext = async () => {
    if (!selectedProfile || !selectedGender) {
      Alert.alert('Error', 'Please select both profile and gender options.');
      return;
    }
  
    setLoading(true);
  
    const requestBody = {
      profileby: selectedProfile,
      gender: selectedGender,
    };
  
    try {
      const response = await fetch('http://82.29.161.246:8002/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (response.status === 201) {
        const userData = {
          matriId: data.matri_id,  // Storage ke liye required field
          token:data.token,
          
        };
        await storeUserData(userData,data.token); // Matri ID store ho rahi hai
        props.navigation.navigate('Screen5'); // Next screen par navigate karega
      } else {
        Alert.alert('Registration Failed', data?.message || 'Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Something went wrong. Please try again.');
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
  
      <TouchableOpacity style={styles1.profileTouchable}>
        <Image source={user?.Icon6} resizeMode="stretch" style={styles1.userimage} />
      </TouchableOpacity>
  
      <View style={{ marginTop: hp('6%'), marginLeft: hp('0%')  }}>
        <Text style={styles1.styletext}>This Profile is Created By </Text>
        
        {options.map((option, index) => (
          <View key={index} style={styles1.optionWrapper}>
            {/* LEFT Option */}
            <TouchableOpacity
              style={[
                styles1.optionContainer,
                { borderWidth: 1.5, borderColor: selectedProfile === option.label ? '#FF7E00' : '#ccc' },
              ]}
              onPress={() => setSelectedProfile(option.label)}
            >
              <View style={[styles1.dot, selectedProfile === option.label && styles1.selectedDot]}>
                {selectedProfile === option.label && (
                  <Image source={tick1?.Icon7} style={styles1.tickIcon} />
                )}
              </View>
              <Text style={styles1.optionText}>{option.label}</Text>
            </TouchableOpacity>
  
            {/* RIGHT Option */}
            {option.rightText && (
              <TouchableOpacity
                style={[
                  styles1.optionContainer,
                  { borderWidth: 1.5, borderColor: selectedProfile === option.rightText ? '#FF7E00' : '#ccc' },
                ]}
                onPress={() => setSelectedProfile(option.rightText)}
              >
                <View style={[styles1.dot, selectedProfile === option.rightText && styles1.selectedDot]}>
                  {selectedProfile === option.rightText && (
                    <Image source={tick1?.Icon7} style={styles1.tickIcon} />
                  )}
                </View>
                <Text style={styles1.optionText}>{option.rightText}</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
  
      {/* Gender Options */}
      {selectedProfile ? (
        <View>
          <Text style={styles1.genderTitle}>Gender</Text>
          {genderOptions.map((option, index) => (
            <View key={index} style={styles1.optionWrapper}>
              <TouchableOpacity
                style={[
                  styles1.optionContainer,
                  { borderWidth: 1.5, borderColor: selectedGender === option.label ? '#FF7E00' : '#ccc' },
                ]}
                onPress={() => handleGenderSelect(option.label)}
              >
                <View style={[styles1.dot, selectedGender === option.label && styles1.selectedDot]}>
                  {selectedGender === option.label && (
                    <Image source={tick1?.Icon7} style={styles1.tickIcon} />
                  )}
                </View>
                <Text style={styles1.optionText}>{option.label}</Text>
              </TouchableOpacity>
  
              {option.rightText && (
                <TouchableOpacity
                  style={[
                    styles1.optionContainer,
                    { borderWidth: 1.5, borderColor: selectedGender === option.rightText ? '#FF7E00' : '#ccc' },
                  ]}
                  onPress={() => handleGenderSelect(option.rightText)}
                >
                  <View style={[styles1.dot, selectedGender === option.rightText && styles1.selectedDot]}>
                    {selectedGender === option.rightText && (
                      <Image source={tick1?.Icon7} style={styles1.tickIcon} />
                    )}
                  </View>
                  <Text style={styles1.optionText}>{option.rightText}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      ) : null}
  
      {/* Continue Button */}
      {showNextButton && (
        <TouchableOpacity
          onPress={handleNext}
          disabled={loading}
          style={[
            styles1.continueButton,
            loading && styles1.continueButtonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles1.NextButtontext}>Continue</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  </View>
      </SafeAreaView>
  
  );
};

export default Screen4;
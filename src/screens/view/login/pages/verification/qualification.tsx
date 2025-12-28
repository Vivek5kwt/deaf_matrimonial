import React, { useState, useEffect } from 'react';
import {
  View, StatusBar, TouchableOpacity, Image, Text, FlatList,
  TextInput, Modal, ScrollView,SafeAreaView
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import styles2 from '../../../../../styles/verification/verificationstyles';
import { arrow, dgree, downarrow } from '../../../../../utils/constants/icons/icon';
import { getUserData } from '../../../../../utils/constants/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const EDUCATION_API_URL = 'http://82.29.161.246:8002/api/education-details';
const REGISTER_API_URL = 'http://82.29.161.246:8002/api/register';

// Horoscope Details Component
const HoroscopeDetails = ({ birthTime, setBirthTime, birthPlace, setBirthPlace }) => {
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const formatTime = (date: any) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };
  
  
  const handleBirthPlaceChange = (text) => {
    // Remove any numbers or special characters using regex
    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
    setBirthPlace(filteredText);
  };
  return (
    <View style={{
      marginTop: hp('3%'),
      padding: wp('5%'),
      borderWidth: 1,
      borderColor: '#FFA500',
      borderRadius: wp('3%'),
      backgroundColor: 'white',
      marginHorizontal: wp('5%')
    }}>
      <Text style={{
        fontSize: wp('4.5%'),
        color: '#FF7E00',
        fontFamily: 'Lexend-Medium'
      }}>
        🌙 Horoscope Details
      </Text>

      <Text style={{
        marginTop: hp('2%'),
        fontFamily: 'Lexend-Medium',
        color: '#333'
      }}>
        Birth Time
      </Text>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: hp('1.5%'),
          borderRadius: wp('2%'),
          marginTop: hp('1%')
        }}
        onPress={() => setTimePickerVisible(true)}
      >
        <Text style={{
          color: birthTime ? '#000' : '#888',
          fontFamily: 'Lexend-Medium'
        }}>
          {birthTime || 'Select Birth Time'}
        </Text>
      </TouchableOpacity>

      <Text style={{
        marginTop: hp('2%'),
        color: '#333',
        fontFamily: 'Lexend-Medium'
      }}>
        Birth Place
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: hp('1.5%'),
          borderRadius: wp('2%'),
          marginTop: hp('1%'),
          fontFamily: 'Lexend-Medium',
          color: '#000',
        }}
        placeholder="Enter Your Birth Place"
        placeholderTextColor="#888"
        value={birthPlace}
        onChangeText={handleBirthPlaceChange}
      />

      <DateTimePicker
        isVisible={isTimePickerVisible}
        mode="time"
        is24Hour={false}
        onConfirm={(date) => {
          setBirthTime(formatTime(date));
          setTimePickerVisible(false);
        }}
        onCancel={() => setTimePickerVisible(false)}
      />
    </View>
  );
};

const Screen10 = (props) => {
  const [selectedQualification, setSelectedQualification] = useState<{ edu_id: number, edu_name: string } | null>(null);
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [educationOptions, setEducationOptions] = useState<{ edu_id: number, edu_name: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matriId, setMatriId] = useState(null);
  const [warning, setWarning] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMatriId = async () => {
      const userData = await getUserData();
      if (!userData || !userData.matriId) {
        setWarning('Matri ID not found. Please restart the registration process.');
      } else {
        setMatriId(userData.matriId);
      }
    };
    fetchMatriId();
  }, []);

  useEffect(() => {
    const fetchEducationDetails = async () => {
      try {
        const response = await fetch(EDUCATION_API_URL);
        const result = await response.json();
        if (result.success) {
          setEducationOptions(result.data);
        }
      } catch (error) {
        console.error('Error fetching education details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducationDetails();
  }, []);

  const isButtonActive = selectedQualification && birthTime && birthPlace;
  const filteredQualifications = educationOptions.filter(item =>
    item.edu_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleContinue = async () => {
    if (!isButtonActive) return;

    const userData = await getUserData();
    if (!userData || !userData.matriId) {
      setWarning('Matri ID not found. Please restart registration.');
      return;
    }

    const payload = {
      matri_id: userData.matriId,
      edu_detail: selectedQualification?.edu_id,
      birthtime: birthTime,
      birthplace: birthPlace,
    };

    try {
      const response = await fetch(REGISTER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        props.navigation.navigate('Screen11');
      } else {
        console.error('Registration failed:', result);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: hp('5%') }}>

      <View style={{ marginHorizontal: wp('5%')}}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: wp('30%'),
            marginHorizontal: wp('30%'),
            padding: hp('2%'),
            paddingHorizontal: wp('10%'),
            backgroundColor: '#FDF1E3',
            borderColor: '#FDF1E3',
          }}
        >
          <Image source={dgree?.Icon14} resizeMode="stretch" style={styles1.userinfoimage} />
        </TouchableOpacity>

        <Text style={styles.blackViewText}>Great! Few more details</Text>
      </View>

      {/* Qualification Dropdown */}
      <View style={{ marginTop: hp('5%'), marginHorizontal: wp('5%') }}>
        <Text style={styles1.textt}>Highest Qualification</Text>
        <TouchableOpacity
          style={[styles1.viewtextinput, styles1.inputContainerrr]}
          onPress={() => setModalVisible(true)}
        >
          <Image source={downarrow?.Icon15} style={styles2.downarrow} />
          <Text style={[styles1.textInput, !selectedQualification && { color: '#999' }]}>
          {selectedQualification?.edu_name || 'Select Qualification'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horoscope Inputs */}
      <HoroscopeDetails
        birthTime={birthTime}
        setBirthTime={setBirthTime}
        birthPlace={birthPlace}
        setBirthPlace={setBirthPlace}
      />

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.emgaborder122,
          {
            backgroundColor: isButtonActive ? '#FF7E00' : '#ccc',
          
          }
        ]}
        onPress={handleContinue}
        disabled={!isButtonActive}
      >
        <Text style={[styles.modalText11, { textAlign: 'center', color: '#fff' }]}>Continue</Text>
      </TouchableOpacity>

      {/* Qualification Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
  <View style={[styles1.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }]}>
    <View style={[styles1.modalContent, { maxHeight: hp('60%'), borderRadius: wp('3%'), backgroundColor: '#fff' }]}>
      
      {/* 🔍 Search Bar */}
      <TextInput
        placeholder="Search Qualification"
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          height: hp(5.5),
          width: wp("80%"),
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: wp(2),
          paddingHorizontal: wp(3),
          marginHorizontal: wp(4),
          marginBottom: hp(1),
          color: 'black',
          backgroundColor: '#f9f9f9',
          fontSize: wp(3.5),
          fontFamily: 'Lexend-Regular'
        }}
      />

      <FlatList
        data={filteredQualifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedQualification(item);
              setModalVisible(false);
              setSearchQuery('');
            }}
            style={{
              paddingVertical: hp('2%'),
              paddingHorizontal: wp('5%'),
              borderBottomWidth: 0.5,
              borderColor: '#ccc'
            }}
          >
            <Text style={{
              fontSize: wp('4%'),
              color: '#333',
              fontFamily: 'Lexend-Regular'
            }}>{item.edu_name}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{ padding: hp('2%'), alignItems: 'center' }}>
            <Text style={{
              fontSize: wp('4%'),
              color: '#888',
              fontFamily: 'Lexend-Regular'
            }}>
              No Results Matched
            </Text>
          </View>
        )}
      />
    </View>
  </View>
</Modal>

    </ScrollView>
    </SafeAreaView>
  );
};

export default Screen10;

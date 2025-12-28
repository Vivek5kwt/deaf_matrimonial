import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import { arrow, backr, family, arrowd, downarrow } from '../../../../../utils/constants/icons/icon';
import { getUserData } from '../../../../../utils/constants/storage';
import Snackbar from 'react-native-snackbar';

// Static Data for Dropdowns
const occupationOptions = [
  { label: 'Engineer', value: 'Engineer' },
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Teacher', value: 'Teacher' },
  { label: 'Business', value: 'Business' },
  { label: 'Other', value: 'Other' },
];

const numberOptions = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4+', value: '4+' },
];

const Screen17 = (props: any) => {
  const [formData, setFormData] = useState({
    fatherOccupation: '',
    motherOccupation: '',
    brothers: '',
    sisters: '',
    marriedBrothers: '',
    marriedSisters: '',
  });
  const [customFatherOccupation, setCustomFatherOccupation] = useState('');
  const [customMotherOccupation, setCustomMotherOccupation] = useState('');
  const [matriId, setMatriId] = useState(null);
  const [showCustomFatherInput, setShowCustomFatherInput] = useState(false);
  const [showCustomMotherInput, setShowCustomMotherInput] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('');
  const [pickerItems, setPickerItems] = useState<any[]>([]);
  const [pickerValue, setPickerValue] = useState('');

  useEffect(() => {
    fetchMatriId();
  }, []);

  const validateSiblingsCount = (field: string, value: string) => {
    const getNumericValue = (val: string) => val === '4+' ? 4 : parseInt(val) || 0;

    const brothers = getNumericValue(formData.brothers);
    const sisters = getNumericValue(formData.sisters);
    const marriedBrothers = getNumericValue(formData.marriedBrothers);
    const marriedSisters = getNumericValue(formData.marriedSisters);
    const newValue = getNumericValue(value);

    if (field === 'marriedBrothers') {
      if (newValue > brothers) {
        Snackbar.show({
          text: 'Married brothers cannot be more than total brothers',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#FF0000',
        });
        return false;
      }
    } else if (field === 'marriedSisters') {
      if (newValue > sisters) {
        Snackbar.show({
          text: 'Married sisters cannot be more than total sisters',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#FF0000',
        });
        return false;
      }
    } else if (field === 'brothers') {
      if (marriedBrothers > newValue) {
        Snackbar.show({
          text: 'Total brothers cannot be less than married brothers',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#FF0000',
        });
        return false;
      }
    } else if (field === 'sisters') {
      if (marriedSisters > newValue) {
        Snackbar.show({
          text: 'Total sisters cannot be less than married sisters',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#FF0000',
        });
        return false;
      }
    }

    return true;
  };

  const openPickerModal = (field: string) => {
    let items = [];
    let currentValue = '';

    if (field === 'fatherOccupation' || field === 'motherOccupation') {
      items = occupationOptions;
      currentValue = formData[field as keyof typeof formData];
    } else {
      items = numberOptions;
      currentValue = formData[field as keyof typeof formData];
    }

    setCurrentPicker(field);
    setPickerItems(items);
    setPickerValue(currentValue);
    setModalVisible(true);
  };

  const handlePickerSelect = (value: string) => {
    setModalVisible(false);

    if (currentPicker === 'fatherOccupation') {
      setShowCustomFatherInput(value === 'Other');
      if (value !== 'Other') {
        setCustomFatherOccupation('');
      }
    }
    if (currentPicker === 'motherOccupation') {
      setShowCustomMotherInput(value === 'Other');
      if (value !== 'Other') {
        setCustomMotherOccupation('');
      }
    }

    if (['brothers', 'sisters', 'marriedBrothers', 'marriedSisters'].includes(currentPicker)) {
      if (!validateSiblingsCount(currentPicker, value)) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [currentPicker]: value,
    }));
  };

  const isFormComplete = () => {
    const requiredFields = ['fatherOccupation', 'motherOccupation', 'brothers', 'sisters', 'marriedBrothers', 'marriedSisters'];
    const allFieldsFilled = requiredFields.every(field => {
      if (field === 'fatherOccupation' && formData.fatherOccupation === 'Other') {
        return customFatherOccupation.trim() !== '';
      }
      if (field === 'motherOccupation' && formData.motherOccupation === 'Other') {
        return customMotherOccupation.trim() !== '';
      }
      return formData[field as keyof typeof formData] !== '';
    });

    if (!allFieldsFilled) return false;

    const getNumericValue = (val: string) => val === '4+' ? 4 : parseInt(val) || 0;
    const brothers = getNumericValue(formData.brothers);
    const sisters = getNumericValue(formData.sisters);
    const marriedBrothers = getNumericValue(formData.marriedBrothers);
    const marriedSisters = getNumericValue(formData.marriedSisters);

    return marriedBrothers <= brothers && marriedSisters <= sisters;
  };

  const fetchMatriId = async () => {
    try {
      const userData = await getUserData();
      if (!userData?.matriId) {
        Alert.alert('Error', 'Matri ID not found. Please restart the registration process.');
      } else {
        setMatriId(userData.matriId);
      }
    } catch (error) {
      console.error('Error fetching Matri ID:', error);
    }
  };

  const handleSubmit = async () => {
    if (!matriId) {
      Alert.alert('Error', 'Matri ID is missing. Please try again.');
      return;
    }

    const getNumericValue = (val: string) => val === '4+' ? 4 : parseInt(val) || 0;
    const brothers = getNumericValue(formData.brothers);
    const sisters = getNumericValue(formData.sisters);
    const marriedBrothers = getNumericValue(formData.marriedBrothers);
    const marriedSisters = getNumericValue(formData.marriedSisters);

    if (marriedBrothers > brothers) {
      Snackbar.show({
        text: 'Married brothers cannot be more than total brothers',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#FF0000',
      });
      return;
    }

    if (marriedSisters > sisters) {
      Snackbar.show({
        text: 'Married sisters cannot be more than total sisters',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#FF0000',
      });
      return;
    }

    if (formData.fatherOccupation === 'Other' && !customFatherOccupation.trim()) {
      Snackbar.show({
        text: 'Please enter father occupation',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#FF0000',
      });
      return;
    }

    if (formData.motherOccupation === 'Other' && !customMotherOccupation.trim()) {
      Snackbar.show({
        text: 'Please enter mother occupation',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#FF0000',
      });
      return;
    }

    try {
      const requestBody = {
        father_occupation: formData.fatherOccupation === 'Other'
          ? customFatherOccupation
          : formData.fatherOccupation,
        mother_occupation: formData.motherOccupation === 'Other'
          ? customMotherOccupation
          : formData.motherOccupation,
        no_of_brothers: formData.brothers,
        no_of_sisters: formData.sisters,
        no_marri_brother: formData.marriedBrothers,
        no_marri_sister: formData.marriedSisters,
        matri_id: matriId,
      };

      console.log('📤 Sending Data to DB:', requestBody);

      const response = await fetch('http://82.29.161.246:8002/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log('✅ API Response:', responseData);

      if (response.ok) {
        props.navigation.navigate('Screen21');
      } else {
        Snackbar.show({
          text: responseData.message || 'Something went wrong!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#FF0000',
        });
      }
    } catch (error) {
      Snackbar.show({
        text: 'Something went wrong!',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#FF0000',
      });
      console.error('❌ API Error:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { paddingHorizontal: wp('5%') }]}>
        <View style={{ marginTop: hp('0%') }}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Image
              source={arrow?.Icon5}
              resizeMode="stretch"
              style={styles.arrowstyle}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              right: "0%",
              top: '15%'
            }}
            onPress={() => props.navigation.navigate('Screen21')}
          >
            <Text style={styles1.lightcolor}>Skip</Text>
            <Image source={backr?.Icon25} style={styles1.backimage1} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: wp('15%'),
              alignSelf: 'center',
              paddingVertical: hp('3%'),
              paddingHorizontal: wp('6%'),
              backgroundColor: '#FDF1E3',
              borderColor: '#FDF1E3',
              marginTop: hp('2%'),
            }}
          >
            <Image
              source={family?.Icon29}
              resizeMode="stretch"
              style={{ width: wp('15%'), height: hp('7%') }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: hp('2%') }}>
          <Text style={{ fontSize: hp('2.5%'), color: 'black', fontFamily: 'Lexend-Medium' }}>
            Add Family Details
          </Text>
          <Text style={{
            fontSize: hp('1.8%'),
            color: '#b4b7b8',
            fontFamily: 'Lexend-Medium',
            marginBottom: hp('1%')
          }}>
            This really helps find common connections
          </Text>

          {/* Father Occupation */}
          <Text style={{
            fontSize: hp('1.8%'),
            color: 'black',
            fontFamily: 'Lexend-Medium',
            marginBottom: hp('0.5%')
          }}>
            Father Occupation
          </Text>
          <TouchableOpacity
            style={[styles1.inputContainer, {
              padding: hp('1.5%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: hp('6%'),
            }]}
            onPress={() => openPickerModal('fatherOccupation')}
          >
            <Text style={{
              color: formData.fatherOccupation ? 'black' : '#b4b7b8',
              fontSize: hp('1.8%'),
              fontFamily: 'Lexend-Regular'
            }}>
              {formData.fatherOccupation || 'Select Father Occupation'}
            </Text>
            <Image source={downarrow?.Icon15} style={{ width: wp('8%'), height: hp('2%') }} />
          </TouchableOpacity>

          {showCustomFatherInput && (
            <TextInput
              style={[styles1.inputContainer, {
                padding: hp('1.5%'),
                marginTop: hp('0.5%'),
                fontSize: hp('1.8%'),
                color: '#333',

              }]}
              placeholder="Enter Father's Occupation"
              value={customFatherOccupation}
              onChangeText={setCustomFatherOccupation}
              placeholderTextColor="#b4b7b8"
            />
          )}

          {/* Mother Occupation */}
          <Text style={{
            fontSize: hp('1.8%'),
            color: 'black',
            fontFamily: 'Lexend-Medium',
            marginBottom: hp('0.5%'),
            marginTop: hp('1%')
          }}>
            Mother Occupation
          </Text>
          <TouchableOpacity
            style={[styles1.inputContainer, {
              paddingVertical: hp('1.5%'),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: hp('6%'),
            }]}
            onPress={() => openPickerModal('motherOccupation')}
          >
            <Text style={{
              color: formData.motherOccupation ? 'black' : '#b4b7b8',
              fontSize: hp('1.8%'),
              fontFamily: 'Lexend-Regular'
            }}>
              {formData.motherOccupation || 'Select Mother Occupation'}
            </Text>
            <Image source={downarrow?.Icon15} style={{ width: wp('8%'), height: hp('2%') }} />
          </TouchableOpacity>

          {showCustomMotherInput && (
            <TextInput
              style={[styles1.inputContainer, {
                padding: hp('1.5%'),
                marginTop: hp('0.5%'),
                fontSize: hp('1.8%'),
                color: '#333',

              }]}
              placeholder="Enter Mother's Occupation"
              value={customMotherOccupation}
              onChangeText={setCustomMotherOccupation}
              placeholderTextColor="#b4b7b8"
            />
          )}

          {[
            { field: 'brothers', label: 'No. of Brothers' },
            { field: 'sisters', label: 'No. of Sisters' },
            { field: 'marriedBrothers', label: 'Married Brothers' },
            { field: 'marriedSisters', label: 'Married Sisters' },
          ].map(({ field, label }, index) => (
            <View key={index} style={{ marginTop: hp('1%') }}>
              <Text style={{
                fontSize: hp('1.8%'),
                color: 'black',
                fontFamily: 'Lexend-Medium',
                paddingVertical: hp('0.9%'),
              }}>
                {label}
              </Text>
              <TouchableOpacity
                style={[styles1.inputContainer, {
                  padding: hp('1.5%'),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: hp('6%'),

                }]}
                onPress={() => openPickerModal(field)}
              >
                <Text style={{
                  color: formData[field as keyof typeof formData] ? 'black' : '#b4b7b8',
                  fontSize: hp('1.8%'),
                  fontFamily: 'Lexend-Regular'
                }}>
                  {formData[field as keyof typeof formData] || `Select ${label}`}
                </Text>
                <Image source={downarrow?.Icon15} style={{ width: wp('8%'), height: hp('2%') }} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={{
            marginBottom: hp('6%'),
            marginHorizontal: wp('17%'),
            backgroundColor: isFormComplete() ? '#FF7E00' : '#E0E0E0',
            paddingVertical: hp('1.2%'),
            borderRadius: wp('5%'),
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: hp('3%'),

          }}
          onPress={handleSubmit}
          disabled={!isFormComplete()}
        >
          <Text
            style={{
              color: isFormComplete() ? '#FFFFFF' : '#AAAAAA',
              fontSize: hp('2%'),
              fontFamily: 'Lexend-Medium'
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>

        {/* Picker Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>            
            <TouchableWithoutFeedback>
                <View style={{
                  backgroundColor: 'white',
                  borderRadius: wp('4%'),
                  width: wp('80%'),
                  maxHeight: hp('50%'),
                  paddingVertical: hp('2%'),
                  paddingHorizontal: wp('3%'),
                }}>
                  <View style={{ padding: wp('4%') }}>
                    <Text style={{
                      fontSize: hp('2.2%'),
                      fontFamily: 'Lexend-Regular',
                      textAlign: 'center',
                      color: "#FF7E00"
                    }}>
                      {currentPicker === 'fatherOccupation' ? 'Father Occupation' :
                        currentPicker === 'motherOccupation' ? 'Mother Occupation' :
                          currentPicker === 'brothers' ? 'No. of Brothers' :
                            currentPicker === 'sisters' ? 'No. of Sisters' :
                              currentPicker === 'marriedBrothers' ? 'Married Brothers' : 'Married Sisters'}
                    </Text>
                  </View>
                  <ScrollView style={{ maxHeight: hp('30%') }}>
                    {pickerItems.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          padding: wp('4%'),
                          borderBottomWidth: 1,
                          borderBottomColor: '#f0f0f0',
                          backgroundColor: pickerValue === item.value ? '#f5f5f5' : 'white',

                        }}
                        onPress={() => handlePickerSelect(item.value)}
                      >
                        <Text style={{
                          fontSize: hp('1.9%'),
                          color: pickerValue === item.value ? 'black' : 'black',
                          fontFamily: 'Lexend-Regular',
                          fontWeight: pickerValue === item.value ? 'normal' : 'normal',
                          alignItems: 'center',
                          alignSelf: 'center'
                        }}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Screen17;
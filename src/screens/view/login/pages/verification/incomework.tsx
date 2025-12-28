import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Modal,
  FlatList,
  Alert,
  SafeAreaView
} from 'react-native';
import axios from 'axios';
import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import { arrow, hand, downarrow } from '../../../../../utils/constants/icons/icon';
import verificationstyles from '../../../../../styles/verification/verificationstyles';
import verificationstyles1 from '../../../../../styles/modal api/verificationstyles';
import { getUserData } from '../../../../../utils/constants/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const EMPLOYMENT_OPTIONS = ['Government', 'Private', 'Business', 'Defence', 'Self Employed', 'Not Working'];
const REGISTER_API_URL = 'http://82.29.161.246:8002/api/register';

const Screen11 = (props: any) => {
  const [annualIncomeId, setAnnualIncomeId] = useState('');
  const [workWith, setWorkWith] = useState('');
  const [workAsId, setWorkAsId] = useState('');
  const [matriId, setMatriId] = useState(null);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [occupationSearchQuery, setOccupationSearchQuery] = useState('');

  const [incomeList, setIncomeList] = useState([]);
  const [occupationList, setOccupationList] = useState([]);

  const [incomeModalVisible, setIncomeModalVisible] = useState(false);
  const [occupationModalVisible, setOccupationModalVisible] = useState(false);
  const [employmentModalVisible, setEmploymentModalVisible] = useState(false);

  useEffect(() => {
    fetchMatriId();
    fetchIncomeList();
    fetchOccupationList();
  }, []);

  useEffect(() => {
    setIsButtonActive(!!(annualIncomeId && workWith && workAsId));
  }, [annualIncomeId, workWith, workAsId]);

  const fetchMatriId = async () => {
    try {
      const userData = await getUserData();
      if (userData && userData.matriId) {
        setMatriId(userData.matriId);
      } else {
        Alert.alert("Error", "Matri ID not found. Please restart the registration process.");
      }
    } catch (error) {
      console.error("Error fetching Matri ID:", error);
    }
  };

  const fetchIncomeList = async () => {
    try {
      const response = await axios.get('http://82.29.161.246:8002/api/incomes');
      if (response.data.success) {
        const sortedIncomeList = response.data.data.sort((a, b) => a.id - b.id);
        setIncomeList(sortedIncomeList);
      }
    } catch (error) {
      console.error('Error fetching income list:', error);
    }
  };

  const fetchOccupationList = async () => {
    try {
      const response = await axios.get('http://82.29.161.246:8002/api/occupations');
      if (response.data.success) {
        setOccupationList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching occupation list:', error);
    }
  };

  const handleSaveData = async () => {
    if (!isButtonActive) return;

    const userData = await getUserData();
    if (!userData || !userData.matriId) {
      Alert.alert('Error', 'Matri ID is missing. Please try again.');
      return;
    }

    const requestData = {
      matri_id: userData.matriId,
      income: incomeList.find(item => item.income === annualIncomeId)?.id || '', // Send income ID
      occupation: workAsId, // Already using ocp_id
      emp_in: workWith,
    };

    try {
      const response = await axios.post(REGISTER_API_URL, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200 || response.status === 201) {
        props.navigation.navigate('Screen15');
      } else {
        Alert.alert('Error', 'Failed to save data. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const filteredOccupations = occupationList.filter(item =>
    item.ocp_name.toLowerCase().includes(occupationSearchQuery.toLowerCase())
  );
  
  const renderModalItem = (label: string, onPress: () => void) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('5%'),
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
      }}
    >
      <Text style={{ fontSize: wp('4%'), color: '#333', fontFamily: 'Lexend-Regular' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ marginHorizontal: wp('5%') }}>
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
              padding: hp('2.5%'),
              paddingHorizontal: wp('10%'),
              backgroundColor: '#FDF1E3',
              borderColor: '#FDF1E3',
              marginTop: hp('2%')
            }}
          >
            <Image source={hand?.Icon16} resizeMode="stretch" style={styles1.userinfoimage} />
          </TouchableOpacity>
          <Text style={styles.blackViewText90}>You are almost done!</Text>
        </View>

        {/* Annual Income */}
        <View style={{ marginTop: hp('5%'), marginHorizontal: wp('5%') }}>
          <Text style={styles1.textt}>Annual Income</Text>
          <TouchableOpacity
            style={[styles1.viewtextinput, styles1.inputContainer]}
            onPress={() => setIncomeModalVisible(true)}
          >
            <Image source={downarrow?.Icon15} style={verificationstyles.downarrow} />
            <TextInput
              style={styles1.textInput}
              placeholder="Your Annual Income"
              placeholderTextColor="#888"
              value={annualIncomeId}
              editable={false}
            />
          </TouchableOpacity>
        </View>

        {/* Work Details */}
        <View style={{ marginTop: hp('0%'), marginHorizontal: wp('5%') }}>
          <Text style={styles1.textt}>Work Details</Text>

          <TouchableOpacity
            style={[styles1.viewtextinput, styles1.inputContainer]}
            onPress={() => setEmploymentModalVisible(true)}
          >
            <Image source={downarrow?.Icon15} style={verificationstyles.downarrow} />
            <TextInput
              style={styles1.textInput}
              placeholder="Employed in"
              placeholderTextColor="#888"
              value={workWith}
              editable={false}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles1.viewtextinput, styles1.inputContainer]}
            onPress={() => setOccupationModalVisible(true)}
          >
            <Image source={downarrow?.Icon15} style={verificationstyles.downarrow} />
            <TextInput
              style={styles1.textInput}
              placeholder="Occupation"
              placeholderTextColor="#888"
              value={occupationList.find(item => item.ocp_id === workAsId)?.ocp_name || ''}
              editable={false}
            />
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.cprofile,
            {
              backgroundColor: isButtonActive ? '#FF7E00' : '#ccc',
            },
          ]}
          onPress={handleSaveData}
          disabled={!isButtonActive}
        >
          <Text style={[styles.modalText11, { color: '#fff', textAlign: 'center' }]}>
            Create Profile
          </Text>
        </TouchableOpacity>

        {/* Income Modal */}
        <Modal visible={incomeModalVisible} transparent animationType="slide">
          <View style={[verificationstyles1.modalContainer1, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }]}>
            <View style={[styles1.modalContent, { maxHeight: hp('60%'), borderRadius: wp('3%') }]}>
              <FlatList
                data={incomeList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) =>
                  renderModalItem(item.income, () => {
                    setAnnualIncomeId(item.income);
                    setIncomeModalVisible(false);
                  })
                }
              />
            </View>
          </View>
        </Modal>

        {/* Employment Modal */}
        <Modal visible={employmentModalVisible} transparent animationType="slide">
          <View style={[verificationstyles1.modalContainer1, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }]}>
            <View style={[styles1.modalContent, { maxHeight: hp('60%'), borderRadius: wp('3%') }]}>
              <FlatList
                data={EMPLOYMENT_OPTIONS}
                keyExtractor={(item) => item}
                renderItem={({ item }) =>
                  renderModalItem(item, () => {
                    setWorkWith(item);
                    setEmploymentModalVisible(false);
                  })
                }
              />
            </View>
          </View>
        </Modal>

        {/* Occupation Modal */}
        <Modal visible={occupationModalVisible} transparent animationType="slide">
          <View style={[verificationstyles1.modalContainer1, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }]}>
            <View style={[styles1.modalContent, { maxHeight: hp('60%'), borderRadius: wp('3%') }]}>
              <TextInput
                placeholder="Search Occupation"
                placeholderTextColor="#999"
                value={occupationSearchQuery}
                onChangeText={setOccupationSearchQuery}
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
                data={filteredOccupations}
                keyExtractor={(item) => item.ocp_id.toString()}
                renderItem={({ item }) =>
                  renderModalItem(item.ocp_name, () => {
                    setWorkAsId(item.ocp_id);
                    setOccupationModalVisible(false);
                    setOccupationSearchQuery('');
                  })
                }
                ListEmptyComponent={() => (
                  <View style={{ padding: hp('2%'), alignItems: 'center' }}>
                    <Text style={{
                      fontSize: wp('4%'),
                      color: '#888',
                      fontFamily: 'Lexend-Regular'
                    }}>
                      No Results Found
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default Screen11;
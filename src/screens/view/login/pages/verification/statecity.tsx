import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  FlatList,
  Modal,
  Alert,
  SafeAreaView
} from 'react-native';
import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import { arrow, downarrow, location } from '../../../../../utils/constants/icons/icon';
import { getUserData } from '../../../../../utils/constants/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const API_BASE_URL = 'http://82.29.161.246:8002/api';

const Screen8 = (props: any) => {
  const [motherTongue, setMotherTongue] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [selectedStateCode, setSelectedStateCode] = useState('');
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [matriId, setMatriId] = useState(null);
  const [motherTongues, setMotherTongues] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const country = 'India';
  const [selectedField, setSelectedField] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchMatriId = async () => {
      try {
        const userData = await getUserData();
        if (userData?.matriId) {
          setMatriId(userData.matriId);
        } else {
          console.warn('Matri ID not found.');
        }
      } catch (error) {
        console.error('Matri ID Fetch Error:', error);
      }
    };
    fetchMatriId();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/mothertongues`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const sortedMotherTongues = data.data.sort((a, b) =>
            a.mtongue_name.localeCompare(b.mtongue_name)
          );
          setMotherTongues(sortedMotherTongues);
        } else {
          console.error('Mother Tongues Fetch Error: Data not successful');
        }
      })
      .catch(err => console.error('Mother Tongues Fetch Error:', err));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/states`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const sortedStates = data.data.sort((a, b) =>
            a.state_name.localeCompare(b.state_name)
          );
          setStates(sortedStates);
        } else {
          console.error('States Fetch Error: Data not successful');
        }
      })
      .catch(err => console.error('States Fetch Error:', err));
  }, []);

  useEffect(() => {
    if (selectedStateCode) {
      fetch(`${API_BASE_URL}/cities/state/${selectedStateCode}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.data)) {
            const sortedCities = data.data.sort((a, b) =>
              a.city_name.localeCompare(b.city_name)
            );
            setCities(sortedCities);
          } else {
            console.error('Cities Fetch Error: Data not successful');
          }
        })
        .catch(err => console.error('Cities Fetch Error:', err));
    }
  }, [selectedStateCode]);

  const openModal = (field: string) => {
    setSelectedField(field);
    let dataToCheck = [];
    if (field === 'motherTongue') dataToCheck = motherTongues;
    if (field === 'state') dataToCheck = states;
    if (field === 'city') dataToCheck = cities;

    if (dataToCheck.length > 0) {
      setModalVisible(true);
      setSearchText('');
    } else {
      console.warn(`No data available for ${field}`);
    }
  };

  const handleSelect = (item: any) => {
    if (selectedField === 'motherTongue') setMotherTongue(item.mtongue_name);
    if (selectedField === 'state') {
      setState(item.state_name);
      setSelectedStateCode(item.state_code);
      setSelectedStateId(item.state_id);
      setCity('');
      setCities([]);
    }
    if (selectedField === 'city') {
      setCity(item.city_name);
      setSelectedCityId(item.city_id);
    }
    setModalVisible(false);
  };

  const getData = () => {
    if (selectedField === 'motherTongue') return motherTongues;
    if (selectedField === 'state') return states;
    if (selectedField === 'city') return cities;
    return [];
  };

  const filteredData = getData().filter(item =>
    selectedField === 'motherTongue'
      ? item.mtongue_name.toLowerCase().includes(searchText.toLowerCase())
      : selectedField === 'state'
        ? item.state_name.toLowerCase().includes(searchText.toLowerCase())
        : item.city_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleContinue = async () => {
    if (!motherTongue || !state || !city || !matriId) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }
  
    const selectedMotherTongue = motherTongues.find(
      (tongue) => tongue.mtongue_name === motherTongue
    );
  
    if (!selectedMotherTongue?.mtongue_id || !selectedStateId || !selectedCityId) {
      Alert.alert('Error', 'Invalid mother tongue, state or city selection.');
      return;
    }
  
    const payload = {
      matri_id: matriId,
      state_id: selectedStateId,           // ✅ DB state_id
      city: selectedCityId,                // ✅ DB city_id
      country_id: 95,                      // ✅ Static for India
      m_tongue: selectedMotherTongue.mtongue_id,  // ✅ Only ID, not name
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok && result.token) {
        props.navigation.navigate('Screen9');
      } else {
        const errorMessage = result.message || 'Registration failed. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };
  

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
              paddingVertical: hp('2.5%'),
              paddingHorizontal: wp('10%'),
              backgroundColor: '#FDF1E3',
              borderColor: '#FDF1E3',
            }}
          >
            <Image source={location?.Icon12} resizeMode="stretch" style={styles1.userinfoimage} />
          </TouchableOpacity>
          <Text style={styles.blackViewText90}>Now let’s build your Profile</Text>
        </View>

        <View style={{ marginTop: hp('5%'), marginHorizontal: wp('5%') }}>
          <Text style={styles1.textt}>Mother Tongue</Text>
          <TouchableOpacity onPress={() => openModal('motherTongue')} style={styles1.viewtextinput}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextInput
                style={[styles1.textInput, { flex: 1 }]}
                placeholder="Select Mother Tongue"
                value={motherTongue}
                editable={false}
                pointerEvents="none"
                placeholderTextColor="#b4b7b8"
              />
              <Image source={downarrow?.Icon15} style={{ width: wp('5%'), height: wp('5%'), marginRight: wp('2%') }} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: wp('5%'), marginTop: hp('-1%') }}>
          <Text style={styles1.textt}>Country</Text>
          <View style={[styles1.viewtextinput, { backgroundColor: '#EAEAEA' }]}>
            <TextInput style={styles1.textInputtt} value={country} editable={false} />
          </View>
        </View>

        <View style={{ marginHorizontal: wp('5%'), marginTop: hp('-1%') }}>
          <Text style={styles1.textt}>State</Text>
          <TouchableOpacity onPress={() => openModal('state')} style={styles1.viewtextinput}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextInput
                style={[styles1.textInput, { flex: 1 }]}
                placeholder="Select State"
                value={state}
                editable={false}
                pointerEvents="none"
                placeholderTextColor="#b4b7b8"
              />
              <Image source={downarrow?.Icon15} style={{ width: wp('5%'), height: wp('5%'), marginRight: wp('2%') }} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ marginHorizontal: wp('5%'), marginTop: hp('-1%') }}>
          <Text style={styles1.textt}>City</Text>
          <TouchableOpacity onPress={() => openModal('city')} style={styles1.viewtextinput} disabled={!selectedStateCode}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextInput
                style={[styles1.textInput, { flex: 1 }]}
                placeholder="Select City"
                value={city}
                editable={false}
                pointerEvents="none"
                placeholderTextColor="#b4b7b8"
              />
              <Image source={downarrow?.Icon15} style={{ width: wp('5%'), height: wp('5%'), marginRight: wp('2%') }} />
            </View>
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} animationType="slide" transparent={false}>
          <View style={{ flex: 1, padding: wp('5%') }}>
            <TextInput
              placeholder="Search..."
              style={{ borderBottomWidth: 1, marginBottom: hp('2%'), padding: wp('3%') }}
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#727272"
            />

            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => {
                if (selectedField === 'motherTongue') return `mt_${item.mtongue_id}_${index}`;
                if (selectedField === 'state') return `st_${item.state_code}_${index}`;
                if (selectedField === 'city') return `ct_${item.city_id}_${index}`;
                return `item_${index}`;
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={{ padding: wp('4%'), borderBottomWidth: 0.5 }}
                >
                      <Text style={{ color: '#000',fontFamily:'Lexend-Regular' }}>  {/* Add this style */}

                    {selectedField === 'motherTongue'
                      ? item.mtongue_name
                      : selectedField === 'state'
                        ? item.state_name
                        : item.city_name}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center', marginTop: hp('2%') }}>No Data Found</Text>
              }
            />
          </View>
        </Modal>

        <TouchableOpacity
          style={[
            styles.emgaborder122,
            {
              backgroundColor: motherTongue && state && city ? '#F57C00' : '#D3D3D3',
             
            }
          ]}
          onPress={handleContinue}
          disabled={!motherTongue || !state || !city}
        >
          <Text style={[
            styles.modalText11,
            { color: motherTongue && state && city ? '#FFF' : '#888', textAlign: 'center' }
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Screen8;

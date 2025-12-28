import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  SafeAreaView,
  useColorScheme,
  TextInput
} from 'react-native';
import { arrow, downarrow, profile, tick1 } from '../../../../utils/constants/icons/icon';
import styles from '../../../../styles/onboadings/styles';
import styles1 from '../../../../styles/onboadings/loginpages/styles';
import maritalStatusData from '../../../../data/maritalStatusData.json';
import axios from 'axios';
import { getUserData } from '../../../../utils/constants/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Religion {
  religion_id: number;
  religion_name: string;
  status: string;
}

interface Caste {
  caste_id: number;
  religion_id: number;
  caste_name: string;
  status: string;
}

const Screen6 = (props: any) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // State for form fields
  const [selectedReligion, setSelectedReligion] = useState('');
  const [selectedReligionId, setSelectedReligionId] = useState<number | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [selectedCasteId, setSelectedCasteId] = useState<number | null>(null);
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState('');
  const [selectedChildrenCount, setSelectedChildrenCount] = useState('');
  const [selectedLivingStatus, setSelectedLivingStatus] = useState('');

  // State for modals
  const [religionModalVisible, setReligionModalVisible] = useState(false);
  const [casteModalVisible, setCasteModalVisible] = useState(false);
  const [maritalStatusModalVisible, setMaritalStatusModalVisible] = useState(false);
  const [childrenCountModalVisible, setChildrenCountModalVisible] = useState(false);
  const [livingStatusModalVisible, setLivingStatusModalVisible] = useState(false);

  // Other state
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [matriId, setMatriId] = useState<string | null>(null);
  const [religions, setReligions] = useState<Religion[]>([]);
  const [castes, setCastes] = useState<Caste[]>([]);
  const [isFetchingCastes, setIsFetchingCastes] = useState(false);

  const maritalStatusOptions = maritalStatusData.maritalStatus;
  const childrenCountOptions = maritalStatusData.childrenCount;
  const livingStatusOptions = maritalStatusData.livingStatus;
  const [casteSearchQuery, setCasteSearchQuery] = useState('');

  useEffect(() => {
    const fetchMatriId = async () => {
      const userData = await getUserData();
      if (userData?.matriId) {
        setMatriId(userData.matriId);
      }
    };

    const fetchReligions = async () => {
      try {
        const response = await axios.get('http://82.29.161.246:8002/api/religions');
        if (response.data.success) {
          const sortedReligions = response.data.data.sort((a: Religion, b: Religion) =>
            a.religion_name.localeCompare(b.religion_name)
          );
          setReligions(sortedReligions);
        }
      } catch (error) {
        console.error('Error fetching religions:', error);
      }
    };


    fetchMatriId();
    fetchReligions();
  }, []);

  useEffect(() => {
    const fetchCastes = async () => {
      if (selectedReligionId) {
        setIsFetchingCastes(true);
        try {
          const response = await axios.get(`http://82.29.161.246:8002/api/castes/${selectedReligionId}`);
          if (response.data.success) {
            const sortedCastes = response.data.data.sort((a: Caste, b: Caste) =>
              a.caste_name.localeCompare(b.caste_name)
            );
            setCastes(sortedCastes);
          }
        } catch (error) {
          console.error('Error fetching castes:', error);
        } finally {
          setIsFetchingCastes(false);
        }
      }
    };


    fetchCastes();
  }, [selectedReligionId]);

  const toggleCheckbox = () => setIsChecked(!isChecked);
  const isFormComplete = () => {
    // Required fields (always)
    if (!selectedReligionId || !selectedCasteId || !selectedMaritalStatus) {
      return false;
    }

    // If marital status requires children count
    const requiresChildren = ["Divorced", "Widower", "Awaiting Divorce"].includes(selectedMaritalStatus);
    if (requiresChildren && !selectedChildrenCount) {
      return false;
    }

    // If children count is selected (and not "None"), require living status
    if (selectedChildrenCount && selectedChildrenCount !== "None" && !selectedLivingStatus) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!isFormComplete() || !matriId || !selectedReligionId || !selectedCasteId) return;

    setIsLoading(true);

    const requestBody = {
      matri_id: matriId,
      religion: selectedReligionId,
      gothra: selectedCasteId,
      caste: selectedCasteId,
      m_status: selectedMaritalStatus.toLowerCase(),
      tot_children: selectedChildrenCount !== '' ? selectedChildrenCount : '0',
      status_children: selectedLivingStatus || 'N/A',
      will_to_mary_caste: isChecked,
    };

    try {
      await axios.post('http://82.29.161.246:8002/api/register', requestBody, {
        headers: { 'Content-Type': 'application/json' },
      });
      props.navigation.navigate('Screen8');
    } finally {
      setIsLoading(false);
    }
  };
  const filteredCastes = castes.filter(caste =>
    caste.caste_name.toLowerCase().includes(casteSearchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.modalItem,
        isDarkMode && { backgroundColor: '#333' }
      ]}
      onPress={() => {
        if (religionModalVisible) {
          setSelectedReligion(item.religion_name);
          setSelectedReligionId(item.religion_id);
          // Reset caste fields when religion changes
          setSelectedCommunity('');
          setSelectedCasteId(null);
          setReligionModalVisible(false);

        } else if (casteModalVisible) {
          setSelectedCommunity(item.caste_name);
          setSelectedCasteId(item.caste_id);
          setCasteModalVisible(false);
        } else if (maritalStatusModalVisible) {
          setSelectedMaritalStatus(item);
          setMaritalStatusModalVisible(false);
          setSelectedChildrenCount('');
          setSelectedLivingStatus('');
        } else if (childrenCountModalVisible) {
          setSelectedChildrenCount(item);
          setChildrenCountModalVisible(false);
          if (item === 'None') setSelectedLivingStatus('');
        } else if (livingStatusModalVisible) {
          setSelectedLivingStatus(item);
          setLivingStatusModalVisible(false);
        }
      }}
    >
      <Text style={[styles.modalItemText, isDarkMode && { color: 'white' }]}>
        {item.religion_name || item.caste_name || item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <ScrollView
        style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}
        contentContainerStyle={{ paddingBottom: hp(5) }}
      >

        <View style={{ marginHorizontal: wp(5) }}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Image
              source={arrow?.Icon5}
              resizeMode="stretch"
              style={[
                styles.arrowstyle,
                isDarkMode && { tintColor: 'white' },
              ]}
            />
          </TouchableOpacity>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: wp(15),
              marginHorizontal: wp(32),
              padding: hp(2),
              backgroundColor: isDarkMode ? '#333' : '#FDF1E3',
              borderColor: isDarkMode ? '#444' : '#FDF1E3',
            }}
          >
            <Image
              source={profile?.Icon9}
              resizeMode="stretch"
              style={{ width: wp(15), height: hp(7.5) }}
            />
          </View>

          <View style={{ marginTop: hp(0) }}>
            <Text style={[styles1.textt, isDarkMode && { color: 'white' }]}>Your Religion</Text>
            <TouchableOpacity
              style={[
                styles1.dropdownContainer,
                isDarkMode && { backgroundColor: '#333', borderColor: '#444' },
                { height: hp(6) }
              ]}
              onPress={() => setReligionModalVisible(true)}
            >
              <Text style={[
                styles.dropdownText,
                isDarkMode && { color: 'white' },
                !selectedReligion && { color: isDarkMode ? '#aaa' : '#888' }
              ]}>
                {selectedReligion || 'Select a religion'}
              </Text>
              <Image
                source={downarrow?.Icon15}
                style={{
                  width: wp(5.5),
                  height: hp(2.75),
                  tintColor: isDarkMode ? 'white' : 'black',
                  position: 'absolute',
                  right: wp(1.5),
                  top: hp(1.5)
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: hp(0) }}>
            <Text style={[styles1.textt, isDarkMode && { color: 'white' }]}>Caste</Text>
            <TouchableOpacity
              style={[
                styles1.dropdownContainer,
                isDarkMode && { backgroundColor: '#333', borderColor: '#444' },
                !selectedReligionId && { opacity: 0.5 },
                { height: hp(6) }
              ]}
              onPress={() => selectedReligionId && setCasteModalVisible(true)}
              disabled={!selectedReligionId}
            >
              <Text style={[
                styles.dropdownText,
                isDarkMode && { color: 'white' },
                !selectedCommunity && { color: isDarkMode ? '#aaa' : '#888' }
              ]}>
                {isFetchingCastes ? 'Loading castes...' : selectedCommunity || 'Select a caste'}
              </Text>
              <Image
                source={downarrow?.Icon15}
                style={{
                  width: wp(5.5),
                  height: hp(2.75),
                  tintColor: isDarkMode ? 'white' : 'black',
                  position: 'absolute',
                  right: wp(1.5),
                  top: hp(1.5)
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Marital Status Dropdown */}
          <View style={{ marginTop: hp(0) }}>
            <Text style={[styles1.textt, isDarkMode && { color: 'white' }]}>Marital Status</Text>
            <TouchableOpacity
              style={[
                styles1.dropdownContainer,
                isDarkMode && { backgroundColor: '#333', borderColor: '#444' },
                { height: hp(6) }
              ]}
              onPress={() => setMaritalStatusModalVisible(true)}
            >
              <Text style={[
                styles.dropdownText,
                isDarkMode && { color: 'white' },
                !selectedMaritalStatus && { color: isDarkMode ? '#aaa' : '#888' }
              ]}>
                {selectedMaritalStatus || 'Select marital status'}
              </Text>
              <Image
                source={downarrow?.Icon15}
                style={{
                  width: wp(5.5),
                  height: hp(2.75),
                  tintColor: isDarkMode ? 'white' : 'black',
                  position: 'absolute',
                  right: wp(1.5),
                  top: hp(1.5)
                }}
              />
            </TouchableOpacity>
          </View>

          {/* Willing to marry checkbox */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: hp(2),
            marginLeft: wp(1)
          }}>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: isDarkMode ? 'white' : '#434150',
                width: wp(5.5),
                height: hp(2.75),
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: wp(2.5),
                borderRadius: wp(1.25),
                backgroundColor: isDarkMode ? '#333' : 'white',
              }}
              onPress={toggleCheckbox}
            >
              {isChecked && (
                <Image
                  source={tick1?.Icon7}
                  style={{
                    tintColor: isDarkMode ? 'white' : 'black',
                    width: wp(4),
                    height: hp(2)
                  }}
                />
              )}
            </TouchableOpacity>
            <Text style={[
              { fontFamily: 'Lexend-Medium', fontSize: wp(3.8) },
              isDarkMode && { color: 'white' }
            ]}>
              Willing to marry in other caste?
            </Text>
          </View>

          {/* Conditional Children Count Dropdown */}
          {selectedMaritalStatus && selectedMaritalStatus !== 'Never Married' && (
            <View style={{ marginTop: hp(0) }}>
              <Text style={[styles1.textt, isDarkMode && { color: 'white' }]}>No. of Children</Text>
              <TouchableOpacity
                style={[
                  styles1.dropdownContainer,
                  isDarkMode && { backgroundColor: '#333', borderColor: '#444' },
                  { height: hp(6) }
                ]}
                onPress={() => setChildrenCountModalVisible(true)}
              >
                <Text style={[
                  styles.dropdownText,
                  isDarkMode && { color: 'white' },
                  !selectedChildrenCount && { color: isDarkMode ? '#aaa' : '#888' }
                ]}>
                  {selectedChildrenCount || 'Select children count'}
                </Text>
                <Image
                  source={downarrow?.Icon15}
                  style={{
                    width: wp(5.5),
                    height: hp(2.75),
                    tintColor: isDarkMode ? 'white' : 'black',
                    position: 'absolute',
                    right: wp(1.5),
                    top: hp(1.5)
                  }}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Conditional Living Status Dropdown */}
          {selectedChildrenCount !== 'None' && selectedChildrenCount && (
            <View style={{ marginTop: hp(0) }}>
              <Text style={[styles1.textt, isDarkMode && { color: 'white' }]}>Children Living Status</Text>
              <TouchableOpacity
                style={[
                  styles1.dropdownContainer,
                  isDarkMode && { backgroundColor: '#333', borderColor: '#444' },
                  { height: hp(6) }
                ]}
                onPress={() => setLivingStatusModalVisible(true)}
              >
                <Text style={[
                  styles.dropdownText,
                  isDarkMode && { color: 'white' },
                  !selectedLivingStatus && { color: isDarkMode ? '#aaa' : '#888' }
                ]}>
                  {selectedLivingStatus || 'Select living status'}
                </Text>
                <Image
                  source={downarrow?.Icon15}
                  style={{
                    width: wp(5.5),
                    height: hp(2.75),
                    tintColor: isDarkMode ? 'white' : 'black',
                    position: 'absolute',
                    right: wp(1.5),
                    top: hp(1.5)
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Continue Button */}
        <View style={{ marginBottom: hp(5), marginHorizontal: wp(5) }}>
          <TouchableOpacity
            disabled={!isFormComplete() || isLoading || !matriId || !selectedReligionId || !selectedCasteId}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: wp(10),
              padding: hp(1.2),
              marginHorizontal: wp(18),
              backgroundColor: isFormComplete() && matriId && selectedReligionId && selectedCasteId ?
                (isDarkMode ? '#FFA726' : '#FF7E00') :
                (isDarkMode ? '#555' : '#ccc'),
              marginTop: hp(3.75),
              borderColor: 'transparent'
            }}
            onPress={handleSubmit}
          >
            <Text style={{
              color: isFormComplete() && matriId && selectedReligionId && selectedCasteId ?
                'white' :
                (isDarkMode ? '#999' : '#666'),
              fontSize: wp(4),
              fontFamily: 'Lexend-Medium',
            }}>
              {isLoading ? 'Submitting...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Religion Modal */}
      <Modal
  visible={religionModalVisible}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setReligionModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setReligionModalVisible(false)}>
    <View style={styles.modalOverlay} />
  </TouchableWithoutFeedback>
  <View style={styles.modalContainer}>
    <View style={[
      styles.modalContent,
      isDarkMode && { backgroundColor: '#333' }
    ]}>
      <FlatList
        data={religions}
        renderItem={renderItem}
        keyExtractor={(item) => item.religion_id.toString()}
      />
    </View>
  </View>
</Modal>



      {/* Caste Modal */}
      <Modal
  visible={casteModalVisible}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setCasteModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setCasteModalVisible(false)}>
    <View style={styles.modalOverlay} />
  </TouchableWithoutFeedback>
  <View style={styles.modalContainer}>
    <View style={[
      styles.modalContent,
      isDarkMode && { backgroundColor: '#333' }
    ]}>
      <TextInput
        placeholder="Search caste..."
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        value={casteSearchQuery}
        onChangeText={setCasteSearchQuery}
        style={{
          height: hp(5.5),
          width: wp("70%"),
          borderColor: isDarkMode ? '#444' : '#ccc',
          borderWidth: 1,
          borderRadius: wp(2),
          paddingHorizontal: wp(3),
          marginBottom: hp(1),
          color: isDarkMode ? 'white' : 'black',
          backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
          fontSize: wp(3.5),
          fontFamily: 'Lexend-Regular'
        }}
      />
      <FlatList
        data={filteredCastes}
        renderItem={renderItem}
        keyExtractor={(item) => item.caste_id.toString()}
        ListEmptyComponent={
          <Text style={[styles.emptyText, isDarkMode && { color: 'white' }]}>
            {isFetchingCastes ? 'Loading castes...' : 'No castes found'}
          </Text>
        }
      />
    </View>
  </View>
</Modal>



      {/* Marital Status Modal */}
      <Modal
  visible={maritalStatusModalVisible}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setMaritalStatusModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setMaritalStatusModalVisible(false)}>
    <View style={styles.modalOverlay} />
  </TouchableWithoutFeedback>
  <View style={styles.modalContainer}>
    <View style={[
      styles.modalContent,
      isDarkMode && { backgroundColor: '#333' }
    ]}>
      <FlatList
        data={maritalStatusOptions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  </View>
</Modal>


      {/* Children Count Modal */}
      <Modal
  visible={childrenCountModalVisible}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setChildrenCountModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setChildrenCountModalVisible(false)}>
    <View style={styles.modalOverlay} />
  </TouchableWithoutFeedback>
  <View style={styles.modalContainer}>
    <View style={[
      styles.modalContent,
      isDarkMode && { backgroundColor: '#333' }
    ]}>
      <FlatList
        data={childrenCountOptions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  </View>
</Modal>


      {/* Living Status Modal */}
      <Modal
  visible={livingStatusModalVisible}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setLivingStatusModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setLivingStatusModalVisible(false)}>
    <View style={styles.modalOverlay} />
  </TouchableWithoutFeedback>
  <View style={styles.modalContainer}>
    <View style={[
      styles.modalContent,
      isDarkMode && { backgroundColor: '#333' }
    ]}>
      <FlatList
        data={livingStatusOptions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
};

export default Screen6;
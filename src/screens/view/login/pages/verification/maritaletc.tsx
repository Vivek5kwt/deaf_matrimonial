import React, { useState, useEffect } from 'react';
import {
  View, TextInput, useColorScheme, TouchableOpacity, Image, SafeAreaView, Text, FlatList, Modal, ActivityIndicator, Alert
} from 'react-native';
import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import { arrow, couple, downarrow } from '../../../../../utils/constants/icons/icon';
import styles2 from '../../../../../styles/verification/verificationstyles';
import { getUserData } from '../../../../../utils/constants/storage';
import { ScrollView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const API_BASE_URL = 'http://82.29.161.246:8002/api';

const weightOptions = Array.from({ length: 151 }, (_, i) => `${30 + i}kg`);
const complexionOptions = ['Very fair', 'Fair', 'Wheatish', 'Wheatish brown', 'Dark'];
const physicalStatusOptions = ['Deaf', 'Hearing Impaired', 'Deaf + Other Disability','Deaf + Usher','Cochlear Implant'];

const Screen9 = (props: any) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [selectedHeight, setSelectedHeight] = useState<{ id: number, height: string } | null>(null);
  const [weight, setWeight] = useState('');
  const [complexion, setComplexion] = useState('');
  const [physicalStatus, setPhysicalStatus] = useState('');
  const [disability, setDisability] = useState('');
  const [heightOptions, setHeightOptions] = useState<{ id: number, height: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [matriId, setMatriId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('#4CAF50');
  const [modalVisible, setModalVisible] = useState<{
    type: 'height' | 'weight' | 'complexion' | 'physicalStatus' | 'disability' | null
  }>({ type: null });

  useEffect(() => {
    const fetchMatriId = async () => {
      const userData = await getUserData();
      if (!userData || !userData.matriId) {
        Alert.alert('Error', 'Matri ID not found. Please restart the registration process.');
      } else {
        setMatriId(userData.matriId);
      }
    };
    fetchMatriId();
  }, []);

  useEffect(() => {
    const fetchHeights = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/heights`);
        const result = await response.json();
        if (result.success) {
          const sortedHeights = result.data.sort((a: any, b: any) => a.id - b.id);
          setHeightOptions(sortedHeights);
        }
      } catch (error) {
        console.error('Error fetching heights:', error);
      }
    };
    fetchHeights();
  }, []);

  const isButtonActive =
    selectedHeight && weight && complexion && physicalStatus &&
    (physicalStatus !== 'Other Physical Disabilities' || disability);

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarColor(type === 'success' ? '#4CAF50' : '#F44336');
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 3000);
  };

  const getFilteredData = () => {
    const originalData =
      modalVisible.type === 'height' ? heightOptions.map(h => h.height) :
      modalVisible.type === 'weight' ? weightOptions :
      modalVisible.type === 'complexion' ? complexionOptions :
      modalVisible.type === 'physicalStatus' ? physicalStatusOptions :
      physicalStatusOptions;

    if (modalVisible.type === 'height' || modalVisible.type === 'weight') {
      return originalData.filter((item: string) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return originalData;
  };

  const handleSubmit = async () => {
    if (!isButtonActive) return;

    const userData = await getUserData();
    if (!userData || !userData.matriId) {
      Alert.alert('Error', 'Matri ID not found. Please restart registration.');
      return;
    }

    setLoading(true);
    try {
      const finalPhysicalStatus =
        physicalStatus === 'Other Physical Disabilities' ? disability : physicalStatus;

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          matri_id: userData.matriId,
          height_id: selectedHeight?.id,
          weight,
          complexion,
          physicalStatus: finalPhysicalStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar('Successfully submitted! Just few details are left', 'success');
        setTimeout(() => props.navigation.navigate('Screen10', { matriId }), 1000);
      } else {
        showSnackbar(data.message || 'Something went wrong.', 'error');
      }
    } catch (error) {
      console.error('API Error:', error);
      showSnackbar('Failed to connect to the server. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderListItem = (item: string, setter: (value: string) => void) => (
    <TouchableOpacity
      style={{
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('5%'),
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
      }}
      onPress={() => {
        if (modalVisible.type === 'height') {
          const selected = heightOptions.find(h => h.height === item);
          if (selected) setSelectedHeight(selected);
        } else {
          setter(item);
        }
        setModalVisible({ type: null });
      }}
      activeOpacity={0.7}
    >
      <Text style={{
        fontSize: wp('4%'),
        color: '#333',
        paddingHorizontal: wp('12%'),
        fontFamily: 'Lexend-Regular'
      }}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: hp('5%') }}>
        <View style={{ paddingHorizontal: wp('5%'), marginTop: hp('3%') }}>
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
            <Image source={couple?.Icon13} resizeMode="stretch" style={styles1.userinfoimage} />
          </TouchableOpacity>
        </View>

        {/* HEIGHT */}
        <View style={{ marginHorizontal: wp('5%'), marginTop: hp('3%') }}>
          <Text style={styles1.textt}>Height</Text>
          <TouchableOpacity
            style={[styles1.viewtextinput, styles1.inputContainerrr]}
            onPress={() => setModalVisible({ type: 'height' })}
          >
            <Image source={downarrow?.Icon15} style={styles2.downarrow} />
            <Text style={[
              styles1.textInput,
              !selectedHeight && { color: '#999' }
            ]}>
              {selectedHeight?.height || 'Select Height'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* WEIGHT */}
        <View style={{ marginHorizontal: wp('5%')}}>
          <Text style={styles1.textt}>Weight</Text>
          <TouchableOpacity
            style={styles1.inputContainerrr}
            onPress={() => setModalVisible({ type: 'weight' })}
          >
            <Image source={downarrow?.Icon15} style={styles2.downarrow} />
            <Text style={[styles1.textInput, !weight && { color: '#999' }]}>
              {weight || 'Select Weight'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* COMPLEXION */}
        <View style={{ marginHorizontal: wp('5%')}}>
          <Text style={styles1.textt}>Complexion</Text>
          <TouchableOpacity
            style={[styles1.viewtextinput, styles1.inputContainerrr]}
            onPress={() => setModalVisible({ type: 'complexion' })}
          >
            <Image source={downarrow?.Icon15} style={styles2.downarrow} />
            <Text style={[styles1.textInput, !complexion && { color: '#999' }]}>
              {complexion || 'Select Complexion'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* PHYSICAL STATUS */}
        <View style={{ marginHorizontal: wp('5%')}}>
          <Text style={styles1.textt}>Physical Status</Text>
          <TouchableOpacity
            style={[styles1.viewtextinput, styles1.inputContainerrr]}
            onPress={() => setModalVisible({ type: 'physicalStatus' })}
          >
            <Image source={downarrow?.Icon15} style={styles2.downarrow} />
            <Text style={[styles1.textInput, !physicalStatus && { color: '#999' }]}>
              {physicalStatus || 'Select Physical Status'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DISABILITY - Conditional */}
        {physicalStatus === 'Other Physical Disabilities' && (
          <View style={{ marginHorizontal: wp('5%') }}>
            <Text style={styles1.textt}>Disability Type</Text>
            <TouchableOpacity
              style={[styles1.viewtextinput, styles1.inputContainerrr]}
              onPress={() => setModalVisible({ type: 'disability' })}
            >
              <Image source={downarrow?.Icon15} style={styles2.downarrow} />
              <Text style={[styles1.textInput, !disability && { color: '#999' }]}>
                {disability || 'Select Disability Type'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CONTINUE BUTTON */}
        <TouchableOpacity
          style={[
            styles.emgaborder122,
            { backgroundColor: isButtonActive ? '#FF7E00' : '#ccc' }
          ]}
          onPress={handleSubmit}
          disabled={!isButtonActive}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.modalText11, { color: '#fff', textAlign: 'center' }]}>Continue</Text>
          )}
        </TouchableOpacity>

        {/* MODAL */}
        <Modal transparent visible={modalVisible.type !== null} animationType="fade">
          <View style={[styles1.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }]}>
            <View style={[styles1.modalContent, { maxHeight: hp('60%'), backgroundColor: '#fff', borderRadius: wp('3%') }]}>
              {(modalVisible.type === 'height' || modalVisible.type === 'weight') && (
                <TextInput
                  placeholder={`Search ${modalVisible.type}`}
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={{
                    height: hp(5.5),
                    width: wp("80%"),
                    borderColor: isDarkMode ? '#444' : '#ccc',
                    borderWidth: 1,
                    borderRadius: wp(2),
                    paddingHorizontal: wp(3),
                    marginHorizontal: wp(4),
                    marginBottom: hp(1),
                    color: isDarkMode ? 'white' : 'black',
                    backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
                    fontSize: wp(3.5),
                    fontFamily: 'Lexend-Regular'
                  }}
                />
              )}

              <FlatList
                data={getFilteredData()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) =>
                  renderListItem(
                    item,
                    modalVisible.type === 'weight' ? setWeight :
                    modalVisible.type === 'complexion' ? setComplexion :
                    modalVisible.type === 'physicalStatus' ? setPhysicalStatus :
                    setDisability
                  )
                }
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Screen9;

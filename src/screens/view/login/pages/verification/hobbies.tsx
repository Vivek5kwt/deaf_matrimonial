import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import { DM, backr } from '../../../../../utils/constants/icons/icon';
import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import styles2 from '../../../../../styles/verification/verificationstyles';
import { icons, getSizeByDimensions } from '../../../../../utils/constants/icons/IconsConfig';
import { getUserData } from '../../../../../utils/constants/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Screen16 = (props: any) => {
  const [selectedOptions, setSelectedOptions] = useState({
    Diet: null,
    Smoking: null,
    Drinking: null,
  });
  const [matriId, setMatriId] = useState(null);

  const [categoryIcons, setCategoryIcons] = useState(() => {
    const copiedIcons = Object.keys(icons).reduce((acc, category) => {
      acc[category] = [...icons[category]];
      return acc;
    }, {});
    return copiedIcons;
  });

  useEffect(() => {
    const fetchMatriId = async () => {
      try {
        const userData = await getUserData();
        if (userData?.matriId) {
          setMatriId(userData.matriId);
        } else {
          Alert.alert("Error", "Matri ID not found. Please restart the registration process.");
        }
      } catch (error) {
        console.error("Error fetching Matri ID:", error);
      }
    };
    fetchMatriId();
  }, []);

  const toggleSelection = (category, iconIndex) => {
    const updatedIcons = [...categoryIcons[category]];
    const selectedIcon = updatedIcons[iconIndex];

    setSelectedOptions(prev => ({
      ...prev,
      [category]: selectedIcon.name,
    }));

    updatedIcons.splice(iconIndex, 1);
    updatedIcons.unshift(selectedIcon);

    setCategoryIcons(prev => ({
      ...prev,
      [category]: updatedIcons,
    }));
  };

  const registerData = async () => {
    if (!matriId) {
      Alert.alert("Error", "Matri ID is missing. Please try again.");
      return;
    }

    const { Diet, Smoking, Drinking } = selectedOptions;

    if (!Diet || !Smoking || !Drinking) {
      Alert.alert("Error", "Please select all options before proceeding.");
      return;
    }

    const requestData = {
      matri_id: matriId,
      diet: Diet.toLowerCase(),
      smoke: Smoking.toLowerCase(),
      drink: Drinking.toLowerCase(),
    };

    try {
      const response = await axios.post('http://82.29.161.246:8002/api/register', requestData);
      if (response.status === 201) {
        props.navigation.navigate('Screen17');
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error registering data:", error);
      Alert.alert("Error", "Failed to register. Please check your network connection.");
    }
  };

  const renderIcons = (category, title) => {
    const iconSize = getSizeByDimensions(wp('25%'), wp('25%'));

    return (
      <View
        style={{
          paddingVertical: hp('2%'),
          borderWidth: 1,
          backgroundColor: 'white',
          borderColor: '#00000040',
          marginTop: hp('2%'),
          marginHorizontal: wp('5%'),
          borderRadius: wp('2%'),
        }}
      >
        <Text style={[styles2.categoryHeading, { marginLeft: wp('3%'), marginBottom: hp('1%') }]}>{title}</Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            paddingHorizontal: wp('3%'),

          }}
        >
          {categoryIcons[category]?.map((item, index) => {
            const isSelected = selectedOptions[category] === item.name;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => toggleSelection(category, index)}
                style={{
                  borderWidth: item.borderWidth || 1,
                  backgroundColor: isSelected ? '#FF7E0026' : '#FFFFFF',
                  margin: wp('2%'),
                  alignItems: 'center',
                  padding: wp('2%'),
                  borderRadius: wp('5%'),
                  paddingHorizontal: wp('3%'),
                  flexDirection: 'row',

                  borderColor: 'green'
                }}
              >
                <Image
                  source={item.icon}
                  style={{ width: iconSize, height: iconSize, resizeMode: 'contain' }}
                />
                <Text style={[styles2.iconText, { marginTop: hp('0%'), marginLeft: hp('0.5%') }]}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const selectedCount = Object.values(selectedOptions).filter(Boolean).length;

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}>

      {/* Header Image & Skip */}
      <View style={{ alignSelf: 'center', marginTop: hp('2%') }}>
        <Image source={DM?.Icon18} style={styles2.DMcentre} />
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: wp('-22%'),
            top: hp('0%'),
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => props.navigation.navigate('Screen17')}
        >
          <Text style={styles1.lightcolor}>Skip</Text>
          <Image source={backr?.Icon25} style={styles1.backimage1} />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={{ borderWidth: 1, borderColor: '#BFBFBF', marginVertical: hp('2%'), marginHorizontal: wp('5%') }} />

      {/* Title */}
      <View style={{ alignSelf: 'center', marginBottom: hp('0%') }}>
        <Text style={styles1.textt3}>Now let’s add</Text>
        <Text style={styles1.textt2}>your hobbies & interests</Text>
        <Text style={styles1.lightcolo1}>This will help find better Matches</Text>
      </View>

      {/* Scrollable Icons */}
      <ScrollView contentContainerStyle={{ paddingBottom: hp('0%') }}>
        {renderIcons('Diet', 'Diet')}
        {renderIcons('Smoking', 'Smoking')}
        {renderIcons('Drinking', 'Drinking')}

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.emgaborder1324,
            {
              opacity: selectedCount === 3 ? 1 : 0.5,

            },
          ]}
          onPress={registerData}
          disabled={selectedCount < 3}
        >
          <Text style={styles.modalText11}>
            Save & continue ({selectedCount}/3)
          </Text>
        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
};

export default Screen16;

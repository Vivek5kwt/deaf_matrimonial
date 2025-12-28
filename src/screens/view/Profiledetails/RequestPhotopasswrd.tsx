import React, { useState } from 'react';
import { View, Text, FlatList, StatusBar, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileCard from '../login/pages/home/View/ProfileViewCard';
import styles1 from '../../../styles/onboadings/loginpages/styles';
import { MemberBG,forVip, group10, img01, img02, img03, img04, showpic } from '../../../utils/constants/images/image';
import {pin, star,diamond,roundBG,roundlogo,disalike,like4,} from '../../../utils/constants/icons/icon';
import verificationstyles from '../../../styles/verification/verificationstyles';
import ProfiledetailHeader from '../../../components/profileDeatilsHeader'; // Import GlobalHeader
import BottomHeader from '../../../components/BottomHeader';


const { width: screenWidth } = Dimensions.get("screen");
const mockProfiles = [
      {
        id: '1',
        name: 'Reetu B',
        age: 27,
        height: "5'8”",
        profession: 'Teacher',
        language: 'Punjabi',
        caste: 'Khatri',
        location: 'Delhi',
        profileImage: img04?.IMG22,
        Education:'BA,MA',
        Religion:'Hindu',
        Caste: 'Khatri',
        Occupation :'Teacher',
      },
    {
        id: 'id45',
        type: 'inviteAd',
        image: showpic?.IMG27,
    
      },
    {
        id: 'ad-1',
        type: 'advertisement',
        image: forVip?.IMG23,
        heading: 'VIPSHAADI',
        subheading: 'For VIPs,',
        subheading1: 'Recommended by VIPs',
        subheading2: 'Trusted by 50k+ VIPs',
        subheading3: 'Top rated consultants',
        subheading4: '5x Success Rates',
      },
    {
        id: '2',
        name: 'Mansi B',
        age: 26,
        height: "5'3”",
        profession: 'Doctor',
        language: 'Punjabi',
        caste: 'Khatri',
        location: 'Delhi',
        profileImage: img02?.IMG20,
        Education:'BA,MA',
        Religion:'Hindu',
        Caste: 'Khatri',
        Occupation :'Teacher',
    
      },
      {
        id: '3',
        name: 'Pooja B',
        age: 24,
        height: "4'5”",
        profession: 'Nurse',
        language: 'Hindi',
        caste: 'Brahmin',
        location: 'Chandigarh',
        profileImage: img01?.IMG19,
        Education:'BA,MA',
        Religion:'Hindu',
        Caste: 'Khatri',
        Occupation :'Teacher',
      },
  

  
  {
    id: '4',
    name: 'Pooja B',
    age: 27,
    height: "5'8”",
    profession: 'Teacher',
    language: 'Punjabi',
    caste: 'Khatri',
    location: 'Delhi',
    profileImage: img04?.IMG22,
    Education:'BA,MA',
    Religion:'Hindu',
    Caste: 'Khatri',
    Occupation :'Teacher',
  },

  
  {
    id: 'id34',
    type: 'customAd',
    image: group10?.IMG25,

  },

  {
    id: 'id46',
    type: 'membersphoto',
    image: MemberBG?.IMG26,
  },
  {
    id: '5',
    name: 'Pooja B',
    age: 24,
    height: "4'5”",
    profession: 'Nurse',
    language: 'Hindi',
    caste: 'Brahmin',
    location: 'Chandigarh',
    Education:'BA,MA',
    Religion:'Hindu',
    Caste: 'Khatri',
    Occupation :'Teacher',
  },

  {
    id: '6',
    name: 'Reetu B',
    age: 27,
    height: "5'8”",
    profession: 'Teacher',
    language: 'Punjabi',
    caste: 'Khatri',
    location: 'Delhi',
    profileImage: img04?.IMG22,
    Education:'BA,MA',
    Religion:'Hindu',
    Caste: 'Khatri',
    Occupation :'Teacher',
  },
  

];

const Screen62 = () => {
  const navigation = useNavigation();
  const profileCounts = {
    // Search: 10,
    // New: 497,
    // Daily: 1,
    // 'My Matches': 2522,
    // 'Near Me': 50,
    // 'More Matches': 100,
  };

  const profileCount = mockProfiles.length;

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <ProfiledetailHeader navigation={navigation} profileCounts={profileCounts} />
      
      <View
        style={{
          width: '100%',
          height: 2,
          backgroundColor: '#EAEAEA',
          marginBottom: 10,
        }}
      />

      <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 15, marginBottom: 15 }}>
        <Text style={{ fontFamily: 'Lexend-Medium', fontSize: 16 }}>Members who joined recently</Text>
        <TouchableOpacity style={{ flexDirection: 'row' }}>
          <Text style={{ fontFamily: 'Lexend-Medium', fontSize: 14 }}>REFINE</Text>
          <Image source={pin?.Icon95} style={{ height: 20, width: 15, tintColor: "#6A696E", marginLeft: 5 }} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockProfiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.type === 'advertisement') {
            return (
              <View style={{ alignItems: 'center', marginBottom: -1, marginTop: -22 }}>
                <Image
                  source={item.image}
                  style={{ width: "95%", height: 500, borderRadius: 5 }}
                  resizeMode="contain"
                />
                <View style={{ position: 'absolute', top: '10%', left: '8%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={diamond?.Icon97} style={{ height: 25, width: 25, marginRight: 5 }} />
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white', fontFamily: 'Lexend-Medium' }}>
                      {item.heading}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, color: 'white', fontFamily: 'Lexend-Medium', marginVertical: 5 }}>
                    {item.subheading}
                  </Text>
                  <Text style={{ fontSize: 16, color: 'white', fontFamily: 'Lexend-Medium', marginBottom: 5 }}>
                    {item.subheading1}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <Image source={star?.Icon96} style={verificationstyles.shortIconstar} />
                    <Text style={{ fontSize: 14, color: 'white', fontFamily: 'Lexend-Medium', marginLeft: 5 }}>
                      {item.subheading2}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <Image source={star?.Icon96} style={verificationstyles.shortIconstar} />
                    <Text style={{ fontSize: 14, color: 'white', fontFamily: 'Lexend-Medium', marginLeft: 5 }}>
                      {item.subheading3}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <Image source={star?.Icon96} style={verificationstyles.shortIconstar} />
                    <Text style={{ fontSize: 14, color: 'white', fontFamily: 'Lexend-Medium', marginLeft: 5 }}>
                      {item.subheading4}
                    </Text>
                  </View>
                  <TouchableOpacity style={{ backgroundColor: '#FF7E00', alignSelf: 'center', paddingHorizontal: 15, padding: 8, marginTop: 20, borderRadius: 20 }}>
                    <Text style={{ fontSize: 18, color: 'white', fontFamily: 'Lexend-Regular', marginLeft: 5 }}>Buy Plans Today</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }

          if (item.type === 'customAd') {
            return (
              <View style={{ alignItems: 'center', marginBottom: 20, width: screenWidth, paddingHorizontal: 12 }}>
                <Image
                  source={item.image}
                  style={{
                    width: '100%',
                    height: 270,
                    borderRadius: 15,
                  }}
                  resizeMode="cover"
                />
                <View style={{ position: 'absolute', top: "60%" }}>
                  <Text
                    style={{
                      marginVertical: 5,
                      textAlign: 'center',
                      fontSize: 15,
                      fontFamily: 'Lexend-Regular',
                      color: '#BFBFBF',
                    }}
                  >
                    Get 10 times better response by calling directly!
                  </Text>

                  <TouchableOpacity
                    style={{
                      marginTop: 10,
                      backgroundColor: '#FF7E00',
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 30,
                      alignSelf: 'center'
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        fontFamily: 'Lexend-Medium',
                      }}
                    >
                      View Plans
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }

          if (item.type === 'inviteAd') {
            return (
              <View style={{ alignItems: 'center', marginBottom: 20, width: screenWidth, paddingHorizontal: 12 }}>
                <Image
                  source={item.image}
                  style={{
                    width: '100%',
                    height: 330,
                    borderRadius: 15,
                  }}
                  resizeMode="cover"
                />
                <View style={{ position: 'absolute', top: "5%", alignSelf: 'center' }}>
                  <Text
                    style={{
                      marginVertical: 5,
                      textAlign: 'center',
                      fontSize: 14,
                      fontFamily: 'Lexend-Medium',
                      color: '#6A696E',
                      alignSelf: 'center',
                      alignContent: 'center',
                      marginHorizontal: -20,
                    }}
                  >
                    You have sent her an invitation on 11 Nov </Text>
                  <Image source={roundBG?.Icon98} style={{ height: 90, width: 90, alignSelf: 'center', borderRadius: 50 }} />
                  <Text
                    style={{
                      marginVertical: 5,
                      textAlign: 'center',
                      fontSize: 15,
                      fontFamily: 'Lexend-Medium',
                      color: '#6A696E',
                    }}
                  >
                    Mansi
                  </Text>
                  <Text
                    style={{
                      marginVertical: 5,
                      textAlign: 'center',
                      fontSize: 15,
                      fontFamily: 'Lexend-Medium',
                      color: '#6A696E',
                    }}
                  >
                    Why want? Connect her directly on
                  </Text>

                  <Text
                    style={{
                      marginVertical: 5,
                      textAlign: 'center',
                      fontSize: 17,
                      fontFamily: 'Lexend-Medium',
                      color: '#6A696E',
                    }}
                  >
                    +9197810XXXXX
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginTop: 10,
                      backgroundColor: '#FF7E00',
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 30,
                      alignSelf: 'center'

                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        fontFamily: 'Lexend-Medium',
                      }}
                    >
                      View Plans
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
          if (item.type === 'membersphoto') {
            return (
              <View style={{ alignItems: 'center', marginBottom: 20, width: screenWidth, paddingHorizontal: 12 }}>
                <Image
                  source={item.image}
                  style={{
                    width: "95%", height: 450,
                    borderRadius: 15,
                  }}
                  resizeMode="cover"
                />
               <View style={{ position: 'absolute', top: "5%" }}>
  <Text
    style={{
      color: 'white',
      fontSize: 18,
      fontFamily: 'Lexend-Medium',
      textAlign: 'center'
    }}
  >
    Members with Photos
  </Text>
  <Text
    style={{
      color: 'white',
      fontSize: 15,
      fontFamily: 'Lexend-Medium',
      alignItems: 'center',
      textAlign: 'center',
      marginBottom: "20%"
    }}
  >
    get twice as many responses
  </Text>
  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
    <View style={{
      position: 'absolute',
      zIndex: 1, 
      borderWidth: 1.5,
      padding: 10,
      width: 140,
      height:180,
      paddingBottom: 20,
      borderRadius: 10,
      borderColor: '#E6E6E6',
      backgroundColor:'white',
      transform: [
        { rotate: '-8deg' }, 
        { translateX: -70 }, 
        { translateY: 110 } 
      ]
    }}>
      <Image source={disalike?.Icon99} style={{ height: 20, width: 15 }} />
      <Image source={roundlogo?.Icon101} style={{ height: 50, width: 50, alignSelf: 'center' }} />
      <Text style={{
        marginVertical: 5,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Lexend-Regular',
        color: '#6A696E',
      }}
      >Sourav Kumar</Text>
      <View style={{ borderWidth: 2.5, borderColor: '#E6E6E6', marginHorizontal: 30, marginBottom: 10, marginTop: 10, borderRadius: 20, marginLeft: 18, justifyContent: 'flex-start' }} />
      <View style={{ borderWidth: 2.5, borderColor: '#E6E6E6', marginRight: "30%", marginLeft: '13%', borderRadius: 20, justifyContent: 'flex-start' }} />
    </View>

    <View style={{
      position: 'absolute',
      zIndex: 2,
      borderWidth: 1.5,
      padding: 10,
      width: 140,
      height:180,
      paddingBottom: 20,
      borderRadius: 10,
      borderColor: '#E6E6E6',
      backgroundColor:'white',
      transform: [
        { rotate: '8deg' }, 
        { translateX: 70 }, 
        { translateY: 110 } 
      ]
    }}>
      <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
        <Text style={{ fontSize: 12, fontFamily: 'Lexend-Medium', alignSelf: 'center' }}>5</Text>
        <Image source={like4?.Icon100} style={{ height: 20, width: 15, alignSelf: 'flex-end' }} />
      </View>
      <Image source={roundBG?.Icon98} style={{ height: 50, width: 50, alignSelf: 'center' }} />
      <Text style={{
        marginVertical: 5,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Lexend-Regular',
        color: '#6A696E',
      }}
      >Shivani</Text>
      <View style={{ borderWidth: 2.5, borderColor: '#E6E6E6', marginHorizontal: 30, marginBottom: 8, marginTop: 10, borderRadius: 20, marginLeft: 18, justifyContent: 'flex-start' }} />
      <View style={{ borderWidth: 2.5, borderColor: '#E6E6E6', marginRight: "30%", marginLeft: '13%', borderRadius: 20, justifyContent: 'flex-start' }} />
    </View>
  </View>
<View style={{position:'absolute',bottom:"-210%"}}>
  <Text
    style={{
      marginVertical: 5,
      textAlign: 'center',
      fontSize: 14,
      fontFamily: 'Lexend-Regular',
      color: '#6A696E',
      marginHorizontal:-10
    }}
  >
    get more responses, add Photos
  </Text>

  <TouchableOpacity
    style={{
      marginTop: 8,
      backgroundColor: '#FF7E00',
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 30,
      alignSelf: 'center'
    }}
  >
    <Text
      style={{
        color: 'white',
        fontSize: 14,
        fontFamily: 'Lexend-Medium',
      }}
    >
      Add photo
    </Text>
  </TouchableOpacity>
  </View>
</View>

              </View>
            );
          }
          return <ProfileCard profile={item} navigation={navigation} />;
        }}
        contentContainerStyle={[styles1.list, { paddingBottom: 60, marginTop: 0 }]}
      />

<View style={verificationstyles.bottomHeaderContainer}>
          <BottomHeader />
        </View>
    </View>
  );
};

export default Screen62;

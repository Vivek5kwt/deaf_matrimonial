import React from 'react';
import { View, Text,SafeAreaView, StyleSheet, TouchableOpacity, Linking,Image,StatusBar } from 'react-native';
import { go, arrow  } from '../../../utils/constants/icons/icon';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Screen64 = (props:any) => {
  // Array of FAQ items
  const faqItems = [
    {
      title: 'Learn how to do registration and see how match making works in Deaf Matrimonial website',
      link: 'https://www.youtube.com/watch?v=SPIrnR6obel&t=33s',
    },
    {
      title: 'Why you should upload right profile photo in your Deaf Matrimonial profile',
      link: 'https://www.youtube.com/watch?v=_QwtJQhSRrM',
    },
  ];

  // Function to handle opening the link
  const handleLinkPress = (url:any) => {
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>

        <View style={{backgroundColor:'#FF7E00',paddingVertical:15,flexDirection:'row',padding:15,paddingTop:"5%"}}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
        </TouchableOpacity>
      <Text style={styles.heading}>FAQ</Text>
      </View>
      <View style={styles.container2}>

      {faqItems.map((item, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.question}>{item.title}</Text>
          <TouchableOpacity onPress={() => handleLinkPress(item.link)}>
            <Text style={styles.link}>{item.link}</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={{alignSelf:'center'}}>
                <Image source={go?.Icon154} style={{height:170,width:180}}/>
                </View>
                </View>

    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  arrowstyle: {
    height: hp('2.2%'),
    width: wp('6%'),
    marginTop: hp('1.2%'),
    tintColor: 'white',
    marginRight: wp('35%'),
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container2: {
    padding: wp('4%'),
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: wp('5.8%'),
    color: 'white',
    textAlign: 'center',
    marginBottom: hp('2%'),
    fontFamily: 'Lexend-Medium',
  },
  faqItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: wp('1.5%'),
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  question: {
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Medium',
    color: '#333333',
    marginBottom: hp('1%'),
  },
  link: {
    fontSize: wp('3.5%'),
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
});

export default Screen64;

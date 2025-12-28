import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar,TouchableOpacity,Image } from 'react-native';
import { arrow } from "../../../utils/constants/icons/icon";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Screen65 = (props:any) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF7E00" barStyle="light-content" />
      <View style={styles.header}>
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Refund Policy & About us</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: 21/11/2023</Text>
        <Text style={styles.paragraph}>
          Thank you for choosing Deaf Matrimonial for your match-making needs.
          Our commitment is to provide a reliable and efficient platform for
          the deaf community to connect and build meaningful relationships. To
          ensure transparency and clarity, we have outlined our refund policy
          below.
        </Text>
        <Text style={styles.subHeading}>Refund Policy Overview:</Text>
        <Text style={styles.paragraph}>
          Deaf Matrimonial is dedicated to offering exceptional match-making
          services to the deaf community in India. As part of our commitment to
          maintaining a high standard of service, we have implemented a
          no-refund policy.
        </Text>
        <Text style={styles.subHeading}>Why No Refunds?
        </Text>
        <Text style={styles.paragraph}>
        Our no-refund policy is in place to maintain fairness and consistency for all our users. The nature of our services involves the provision of a platform for individuals to connect and interact, and as such, once the service is initiated, it cannot be reversed.
        </Text>
        <Text style={styles.subHeading}>Cancellation of Subscription:</Text>
        <Text style={styles.paragraph}>
        Users have the option to cancel their subscription at any time. However, please note that the cancellation will not result in a refund, and the subscription will remain active until the end of the billing cycle.
        </Text>
        <Text style={styles.subHeading}>Contact Us:
        </Text>
        <Text style={styles.paragraph}>
         
If you have any questions or concerns about our refund policy, please contact us at info@deafmatrimonial.com Our customer support team is here to assist you.
        </Text>
        <Text style={styles.subHeading}>Changes to Refund Policy:</Text>
        <Text style={styles.paragraph}>
        Deaf Matrimonial reserves the right to update or modify this refund policy at any time without prior notice. Users are encouraged to review this page periodically for any changes.
        </Text>
       
        <Text style={styles.paragraph}>
        By using Deaf Matrimonial's services, you agree to abide by the terms and conditions outlined in this refund policy.
        </Text>
        <Text style={styles.subHeading2}>About Us:-</Text>
        <Text style={styles.paragraph}>
        Deaf Matrimonial refers to a matchmaking service specifically designed for people who are deaf or hard of hearing. 
        </Text>
        <Text style={styles.paragraph}>
        Deaf Matrimonial provides a platform for individuals who are looking for a life partner with whom they can communicate easily and comfortably, without any language barriers.</Text>
        <Text style={styles.paragraph}>
        Deaf matrimonial services typically offer a range of features such as creating a profile, searching for suitable matches, and messaging or chatting with potential partners. </Text>
        <Text style={styles.paragraph}>
        Overall, deaf matrimonial services aim to facilitate meaningful and long-lasting relationships between deaf or hard-of-hearing individuals who share common interests, values, and goals.</Text>
    
        <Text style={styles.paragraph}>
        Thank you for choosing Deaf Matrimonial.
        </Text>
        <View style={{paddingVertical:50}}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowstyle: {
    height: hp('2.2%'),         // ~18px
    width: wp('6%'),            // ~22px
    marginTop: hp('1.5%'),      // ~30px
    tintColor: 'white',
    marginRight: wp('15%'),     // ~60px
    marginLeft: wp('-5%'),     // ~-50px
  },
  container: {
    flex: 1,
    backgroundColor: '#FF7E00',
  },
  header: {
    backgroundColor: '#FF7E00',
    paddingBottom: hp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: hp('2.5%'),       // ~20px
    fontFamily: 'Lexend-Medium',
    textAlign: 'center',
    marginLeft: wp('-5%'),     // ~-50px

  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp('4%'),
    borderTopRightRadius: wp('4%'),
    padding: wp('4%'),
  },
  lastUpdated: {
    fontSize: hp('1.8%'),       // ~14px
    color: '#555555',
    marginBottom: hp('2%'),
    fontFamily: 'Lexend-Medium',
  },
  paragraph: {
    fontSize: hp('2%'),         // ~16px
    color: '#333333',
    marginBottom: hp('2%'),
    fontFamily: 'Lexend-Medium',
    lineHeight: hp('3%'),       // ~22px
  },
  subHeading: {
    fontSize: hp('2.3%'),       // ~18px
    color: '#000000',
    marginBottom: hp('1%'),
    fontFamily: 'Lexend-Medium',
  },
  subHeading2: {
    fontSize: hp('2.5%'),       // ~20px
    color: '#FF7E00',
    marginBottom: hp('1%'),
    fontFamily: 'Lexend-Medium',
  },
});

export default Screen65;

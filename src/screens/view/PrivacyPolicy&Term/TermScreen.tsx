import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { arrow } from '../../../utils/constants/icons/icon';
const Screen45 = (props: any) => {
  const termsContent = [
    {
      title: '1. Acceptance of Terms',
      text: 'By registering on [Platform Name], you acknowledge that you have read, understood, and agreed to these Terms and Conditions, as well as our Privacy Policy.',
    },
    {
      title: '2. Eligibility',
      text: `• This platform is exclusively for individuals who identify as deaf or hard of hearing and are looking for a matrimonial alliance.\n• You must be at least 18 years old to register and use our services.\n• Users must provide accurate and verifiable information during registration.`,
    },
    {
      title: '3. Registration and Account',
      text: '• You are required to provide accurate, complete, and truthful information while creating your profile.\n• Only one account per user is allowed.\n• Any fraudulent or misleading information may lead to immediate account termination.',
    },
    {
      title: '4. User Conduct',
      text: '• You agree to use this platform responsibly and respectfully.\n• Any form of harassment, abuse, or inappropriate behavior will not be tolerated and may result in account suspension or termination.\n• You must not share any offensive or discriminatory content.',
    },
    {
      title: '5. Privacy and Communication',
      text: '• Your personal information will be used as per our Privacy Policy.\n• You agree to receive communication from other users and the platform for matchmaking and updates.\n• Users are encouraged to maintain confidentiality and not share personal details until they feel comfortable.',
    },
    {
      title: '6. Payment and Subscription (if applicable)',
      text: '• Certain features may require a paid subscription.\n• Fees are non-refundable unless specified otherwise.',
    },
    {
      title: '7. Disclaimer',
      text: '• [Platform Name] does not guarantee successful matches or marriages.\n• The platform is a medium to connect like-minded individuals, and users are responsible for making informed decisions.',
    },
    {
      title: '8. Termination',
      text: '• Deaf Matrimonial  reserves the right to terminate any account that violates these Terms and Conditions.\n• Users may delete their account at any time by contacting customer support.',
    },
    {
      title: '9. Changes to Terms and Conditions',
      text: '• Deaf Matrimonial reserves the right to modify these Terms and Conditions at any time. Updates will be communicated to users.',
    },
    {
      title: '10. Governing Law',
      text: '• These Terms and Conditions shall be governed by and construed in accordance with the laws of Indian.',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={{backgroundColor:'#FF7E00',paddingVertical:15,flexDirection:'row',paddingTop:"5%",}}>
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
        </TouchableOpacity>
        <Text style={styles.header}>Terms & Conditions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.sectionText}>Welcome to Deaf Matrimonial. By accessing or using our services, you agree to the following Terms and Conditions. Please read them carefully before proceeding.</Text>

        {termsContent.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionText}>{section.text}</Text>
            <Text style={styles.sectionText}>If you have any questions or concerns regarding these Terms and Conditions, please contact us at [Contact Email].</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowstyle: {
    height: 18,
    width: 22,
    marginTop: 10,
    tintColor:'white',
    marginRight:"20%",
    marginLeft:20,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily:'Lexend-Medium',
  },
  scrollViewContent: {
    paddingBottom: 20,
    padding:20,
    },
  section: {
    marginVertical: 10,

  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Lexend-Medium',
    color: 'black'
  },
  sectionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    fontFamily: 'Lexend-Regular',
    marginBottom: 15,
    marginTop:10

  },
});

export default Screen45;

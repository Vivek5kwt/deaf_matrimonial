import React from 'react';
import { View, Text, ScrollView, StyleSheet,TouchableOpacity,Image } from 'react-native';
import { arrow } from '../../../utils/constants/icons/icon';

const Screen46 = (props:any) => {
  const privacyContent = [
    {
      title: '1. Information We Collect',
      text: `We collect personal information to facilitate matchmaking services. This includes:\n 1.1 Personal Details\n• Name, age, gender, date of birth, and marital status.\n1.2 Contact Information\n• Email address, phone number, and physical address.\n1.3 Profile Information\n• Details about your preferences, interests, photographs, and any other information you choose to provide in your profile.\n1.4 Usage Data\n• IP address, browser type, and interactions on the platform for analytics and security purposes.`,
    },
    {
      title: '2. How We Use Your Information',
      text: `We use your personal data for:\n2.1 Profile Creation and Display:\n• To create and display your profile for potential matches.\n2.2 Communication\n• To facilitate communication between users.\n2.3 Improving Services\n• To enhance platform functionality, user experience, and security.\n2.4 Notifications and Updates\n• To send important updates, newsletters, and promotional offers (if opted in).`,
    },
    {
      title: '3. Sharing Your Information',
      text: `We do not sell, rent, or share your personal information with third parties, except in the following cases:\n3.1 With Other Users \n• Profile information is shared with other users to facilitate matchmaking.\n3.2 Service Providers\n• Third-party service providers who assist us in platform operations, under strict confidentiality agreements.\n3.3 Legal Compliance\n• When required by law or to protect the rights, property, or safety of our users or platform.`,
    },
    {
        title: '4. Security of Your Information',
        text: `We implement advanced security measures to protect your data against unauthorized access, alteration, or disclosure. However, no method of online storage is completely secure, and we cannot guarantee absolute data security.`,
      },
      {
        title: '5. Your Rights',
        text: `You have the right to:\n• Access and update your personal information.\n• Delete your profile and associated data.\n• Opt-out of promotional communications.\nTo exercise these rights, please contact us at [Contact Email].`,
      },
      {
        title: '6. Data Retention',
        text: `We retain your personal data for as long as your account is active or as needed to provide our services. Upon account deletion, your data will be removed within a reasonable timeframe, except where required by law.`,
      },
      {
        title: '7. Cookies and Tracking Technologies',
        text: `We use cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze usage trends. You can manage your cookie preferences through your browser settings.`,
      },
      {
        title: '8. Privacy of Children',
        text: `Our platform is not intended for users under the age of 18. We do not knowingly collect personal information from children.`,
      },
      {
        title: '9. Changes to This Privacy Policy',
        text: `We may update this Privacy Policy from time to time. Changes will be communicated through the platform, and continued use of the platform implies acceptance of the updated policy.`,
      },
      {
        title: '10. Contact Us',
        text: `If you have any questions, concerns, or feedback regarding this Privacy Policy, please contact us at:\n• Email: [Contact Email]\n• Phone: [Contact Number]`,
      },
  ];

  return (
    <View style={styles.container}>
       <View style={{backgroundColor:'#FF7E00',paddingVertical:15,flexDirection:'row',paddingTop:"5%",}}>
       <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
        </TouchableOpacity>
        <Text style={styles.header}>Privacy Policy</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.sectionText}>At Deaf Matrimonial, we value your trust and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data to provide a safe and meaningful experience on our platform. By using our services, you agree to the practices described below.</Text>
        {privacyContent.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionText}>{section.text}</Text>
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
        marginBottom: 10,
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
        fontFamily: 'Lexend-Medium',
        marginBottom: 15,
        marginTop:10
      },
});

export default Screen46;

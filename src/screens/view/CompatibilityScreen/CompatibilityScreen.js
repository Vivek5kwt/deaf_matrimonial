import React, { useState } from 'react';
import { ScrollView, StyleSheet, View,StatusBar } from 'react-native';
import UserProfilePicture from '../../../components/UserProfile/UserProfilePicture';
import UserProfileDetails from '../../../components/UserProfile/UserProfileDetails';
import CompatibilityScore from '../../../components/Compatibility/CompatibilityScore';
import BirthChartDetails from '../../../components/AstroDetails/BirthChartDetails';

const Screen31 = () => {
  const [totalScore, setTotalScore] = useState(0);
  const [totalMaxScore, setTotalMaxScore] = useState(0);

  return (
    <ScrollView style={styles.container}>

      <View style={styles.profileSection}>
      <UserProfilePicture
        profileImage={require('../../../assets/images/forVip.png')} // Replace with actual image paths
        secondaryImage={require('../../../assets/images/image4.png')} // Replace with actual image paths
      />
        <UserProfileDetails
          name="Varun"
          timeOfBirth="08:00 AM"
          placeOfBirth="Patiala, Punjab, India"
          manglikDosha="Don’t know"
          Raashi="Pisces (Meen)"
          nakshatra="Uttra Bhadrapada"
          totalScore={totalScore} // Pass totalScore
          totalMaxScore={totalMaxScore} // Pass totalMaxScore
        />
      </View>

      <CompatibilityScore
        setTotalScore={setTotalScore} // Set totalScore in parent
        setTotalMaxScore={setTotalMaxScore} // Set totalMaxScore in parent
      />

      <BirthChartDetails
       name="Varun"
        dateOfBirth="**/**/****"
        timeOfBirth="**:**"
        placeOfBirth="Other, Punjab, India"
        raashi="Taurus(Vrishbh)"
        nakshatra="Rohini"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
});

export default Screen31;

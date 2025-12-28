import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { editbutton } from '../../utils/constants/icons/icon';
import ModalContent from '../ModalContent/ModalContent';

const UserProfileDetails = ({ name, timeOfBirth, placeOfBirth, manglikDosha, totalScore, totalMaxScore, Raashi, Nakshatra }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Default to false to ensure modal isn't open initially

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Your Compatibility with {name || 'User Name'}</Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.totalScore}>{totalScore}</Text>
        <Text style={styles.divider}> / </Text>
        <Text style={styles.maxScore}>{totalMaxScore}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.textt}>Predictions are based on your details.</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>        
          <Image source={editbutton?.Icon112} style={styles.icons} />
        </TouchableOpacity>
      </View>
      
      <ModalContent
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Time of Birth:</Text>
          <Text style={styles.value}>{timeOfBirth || 'Not provided'}</Text>
        </View>

        <View style={styles.detailBox}>
          <Text style={styles.label}>Place of Birth:</Text>
          <Text style={styles.value}>{placeOfBirth || 'Not provided'}</Text>
        </View>

        <View style={styles.detailBox}>
          <Text style={styles.label}>Manglik Dosha:</Text>
          <Text style={styles.value}>{manglikDosha || 'Don’t know'}</Text>
        </View>

        <View style={styles.detailBox}>
          <Text style={styles.label}>Raashi</Text>
          <Text style={styles.value}>{Raashi || 'Not provided'}</Text>
        </View>

        <View style={styles.detailBox}>
          <Text style={styles.label}>Nakshatra</Text>
          <Text style={styles.value}>{Nakshatra || 'Not provided'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: "15%",
  },
  name: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'Lexend-Medium',
    color: 'black',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalScore: {
    fontSize: 25,
    color: '#4CAF50',
    fontFamily: 'Lexend-Medium',
  },
  divider: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'Lexend-Medium',
  },
  maxScore: {
    fontSize: 20,
    color: '#FF5722',
    fontFamily: 'Lexend-Medium',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textt: {
    color: 'black',
    fontFamily: 'Lexend-Medium',
  },
  icons: {
    height: 24,
    width: 52,
    marginRight: 5,
  },
  scrollContainer: {
    marginTop: 10,
  },
  detailBox: {
    alignSelf: 'flex-start',
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Lexend-Medium',
  },
  value: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: 'black',
  },
});

export default UserProfileDetails;

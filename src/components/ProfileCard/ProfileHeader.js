import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { img02, img03 } from '../../utils/constants/images/image';
import { arrow2 } from '../../utils/constants/icons/icon';

const ProfileHeader = ({ bgImage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text1}>You & Her</Text>
      <Image source={bgImage} style={styles.background} />
      <View style={styles.profileContainer}>
        <Image source={img02?.IMG20} style={styles.leftImage} />
        <Image source={arrow2?.Icon110} style={styles.centerImage} />
        <Image source={img03?.IMG21} style={styles.rightImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  text1: {
    fontSize: 18,
    position: 'absolute',
    color: 'grey',
    fontFamily:'Lexend-Medium'
  },
  background: {
    width: '112%',
    height: 220,
    resizeMode: 'cover',
    marginTop:-20
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top:'20%',
  },
  leftImage: {
    width: 60,
    height: 60,
    borderRadius: 35, // Circular shape
    marginRight: -12, // Overlap with the center image
    zIndex: 1, // Show above the right image
  },
  centerImage: {
    width: 25,
    height: 25,
    borderRadius: 45, 
    zIndex: 2, 
  },
  rightImage: {
    width: 60,
    height: 60,
    borderRadius: 35, // Circular shape
    marginLeft: -12, // Overlap with the center image
    zIndex: 1, // Show above the left image if needed
  },
});

export default ProfileHeader;

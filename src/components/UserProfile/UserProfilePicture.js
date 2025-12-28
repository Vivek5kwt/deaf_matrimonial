import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const UserProfilePicture = ({ profileImage, secondaryImage }) => {
  return (
    <View style={styles.container}>
      <Image source={profileImage} style={styles.profileImage} />
      <Image source={secondaryImage} style={styles.secondaryImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', // Align the images vertically
    position: 'absolute', // Position them at the top-left
    top: 10, // Distance from the top
    left: 10, // Distance from the left
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: -10, // Overlap the images slightly
    borderWidth: 2,
    borderColor: '#fff', // Add a border for better visibility
    marginLeft:15,
    marginTop:10
  },
  secondaryImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff', // Add a border for better visibility
  },
});

export default UserProfilePicture;

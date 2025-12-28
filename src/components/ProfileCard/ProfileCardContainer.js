import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileHeader from './ProfileHeader';
import PreferenceList from './PreferenceList';
import MatchDetails from './MatchDetails';

const ProfileCardContainer = ({ bgImage, checkmarkIcon, dividerIcon }) => {
  return (
    <View style={styles.container}>
      <ProfileHeader bgImage={bgImage} />
      <PreferenceList checkmarkIcon={checkmarkIcon} dividerIcon={dividerIcon} />
      <MatchDetails checkmarkIcon={checkmarkIcon} dividerIcon={dividerIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginHorizontal: 15,
  },
});

export default ProfileCardContainer;

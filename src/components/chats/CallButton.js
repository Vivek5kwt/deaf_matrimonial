import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const CallButton = ({ type, onPress }) => {
  const iconSource = type === 'audio' 
    ? require('../../assets/icons/chatphone.png') 
    : require('../../assets/icons/chatvedio.png');

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Image source={iconSource} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { padding: 10, marginHorizontal: 5 },
  icon: { width: 40, height: 40,marginLeft:-40 },
});

export default CallButton;

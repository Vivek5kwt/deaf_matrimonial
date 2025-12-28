import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native';
import { orgcheck } from '../../utils/constants/icons/icon';

const ConnectButton = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Image source={orgcheck?.Icon30} style={styles.icon}/>
        <Text style={styles.buttonText}>Connect Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  icon:{
 tintColor:'white',
 height:20,
 width:20,
 alignSelf:'center'
  },
  container: {
    alignItems: 'center',
    marginVertical: 16,
  marginBottom:-10,
  },
  button: {
    backgroundColor: '#FF7E00',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 15,
    elevation: 3,
    flexDirection:'row'
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Lexend-Bold',
  },
});

export default ConnectButton;

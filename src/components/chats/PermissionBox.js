import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PermissionBox = ({ onChangePermission }) => {
  return (
    <View style={styles.container}>
      <View style={{borderWidth:1,alignSelf:'center',paddingVertical:5,borderRadius:30,paddingHorizontal:16,borderColor:'#FF7E00'}}>
      <Text style={styles.alertIcon}>!</Text>
      </View>
      <Text style={styles.message1}>Your Matches can't reach you!</Text>
      <Text style={styles.message}>You can't receive voice calls since you haven't given the necessary permissions.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onChangePermission}>
        <Text style={styles.buttonText}>Change Permission</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding:10, borderRadius: 8,borderWidth:1,borderColor:"#00000040",marginBottom:20},
  alertIcon: { fontSize: 20, color: '#FF7E00', textAlign: 'center' },
  message1: { fontSize: 15, color: 'black', textAlign: 'center',marginTop:5 ,fontFamily:'Lexend-Regular'},
  message: { fontSize: 12, color: '#555', textAlign: 'center', marginVertical: 10 ,fontFamily:'Lexend-Regular',paddingHorizontal:30},
  button: { backgroundColor: '#FF7E00', paddingVertical: 10,paddingHorizontal:20, borderRadius: 30,alignSelf:'center' },
  buttonText: { color: '#fff', textAlign: 'center',fontFamily:'Lexend-Medium' },
});

export default PermissionBox;

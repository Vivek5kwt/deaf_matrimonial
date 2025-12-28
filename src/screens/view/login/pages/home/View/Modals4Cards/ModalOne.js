import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import { camera1 } from '../../../../../../../utils/constants/icons/icon';

const { height } = Dimensions.get('window'); // Get screen height

const ModalOne = ({ visible, onClose }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          <Image
            source={camera1?.Icon127}
            style={styles.icon}
          />
          <Text style={styles.description}>Anjali D Privacy Setting allows only Premium Members to view her album</Text>
          <View style={{marginTop:25}}>

          <Text style={styles.upgradeText}>Upgrade to Premium to see album</Text>
          <TouchableOpacity style={styles.viewPlansButton} onPress={() => alert('View Plans Pressed')}>
            <Text style={styles.buttonText}>View Plans</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    height: height * 0.5, // 50% of screen height
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0, // Position the modal at the bottom
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  icon: {
    width: 110,
    height: 70,
    marginVertical: 20,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    fontFamily:'Lexend-Medium'

  },
  upgradeText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    fontFamily:'Lexend-Medium'

  },
  viewPlansButton: {
    backgroundColor: '#FF7E00',
    paddingHorizontal: 30,
    paddingVertical:10,
    borderRadius: 30,
    marginTop: 20,
    alignSelf:'center'
  },
  buttonText: {
    color: 'white',
    fontFamily:'Lexend-Medium'
  },
});

export default ModalOne;

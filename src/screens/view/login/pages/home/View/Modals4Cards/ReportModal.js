import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity,Image } from 'react-native';
import { angel } from '../../../../../../../utils/constants/icons/icon';

const ReportModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
        <Image source={angel?.Icon132}style={styles.title}/>
          <Text style={styles.message}>
            Your complaint will be sent to the DealMatrimonial.com team for review. We will notify you of the action taken.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                alert('Report Sent!');
                onClose();
              }}
            >
              <Text style={styles.primaryButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '85%',
  },
  title: {
    height:55,
    width:60,
    alignSelf:'center',
    resizeMode:'contain',
    paddingVertical:40,
  },
  message: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
    fontFamily:'Lexend-Regular'

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#555',
    fontFamily:'Lexend-Medium'

  },
  primaryButton: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 5,
    backgroundColor: '#f59e0b',
    borderRadius: 5,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontFamily:'Lexend-Medium'
  },
});

export default ReportModal;

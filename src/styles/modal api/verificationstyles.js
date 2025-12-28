import { StyleSheet } from 'react-native';

const verificationstyles1 = StyleSheet.create({
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    elevation: 5, // Shadow effect for Android
    shadowColor: '#000', // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  modalItem1: {
    padding: 15,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontFamily:'Lexend-Medium',
  },
  modalItemLast: {
    padding: 15,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#FF7E00',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default verificationstyles1;

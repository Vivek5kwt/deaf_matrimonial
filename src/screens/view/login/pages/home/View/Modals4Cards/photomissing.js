import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { cross, gallery, cameral } from '../../../../../../../utils/constants/icons/icon';

const PhotoMissingModal = ({ visible, onClose }) => {
  const [isSecondModalVisible, setSecondModalVisible] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const openSecondModal = () => {
    setSecondModalVisible(true);
  };

  const closeSecondModal = () => {
    setSecondModalVisible(false);
    setActiveButton(null);
    onClose(); // Close the first modal when the second modal is closed
  };

  const handleOptionSelect = (option) => {
    setActiveButton(option);
    if (option === 'gallery') {
      openGallery();
    } else if (option === 'camera') {
      openCamera();
    }
  };

  const openGallery = () => {
    const options = { mediaType: 'photo' };
    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        console.log('Selected Image:', response.assets);
      }
      closeSecondModal(); // Close both modals after selecting from the gallery
    });
  };

  const openCamera = () => {
    const options = { mediaType: 'photo' };
    launchCamera(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        console.log('Captured Image:', response.assets);
      }
      closeSecondModal(); // Close both modals after capturing an image
    });
  };

  return (
    <>
      {/* First Modal */}
      <Modal visible={visible && !isSecondModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Self Photo Missing</Text>
            <Text style={styles.message}>
              You can request Ayesha S for a photo after your own photo is added
              to your profile.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  activeButton === 'cancel' && styles.activeButton,
                ]}
                onPress={() => {
                  setActiveButton('cancel');
                  onClose(); // Close the first modal directly
                }}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    activeButton === 'cancel' && styles.activeText,
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  activeButton === 'addPhoto' && styles.activeButton,
                ]}
                onPress={() => {
                  setActiveButton('addPhoto');
                  openSecondModal(); // Open the second modal
                }}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    activeButton === 'addPhoto' && styles.activeText,
                  ]}
                >
                  Add Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Second Modal */}
      <Modal
        visible={isSecondModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeSecondModal}
      >
        <View style={styles.bottomModalOverlay}>
          <View style={styles.bottomModalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={closeSecondModal}>
              <Image source={cross?.Icon28} style={styles.closeButtonIcon} />
            </TouchableOpacity>

            <Text style={styles.title}>Add Photos</Text>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                activeButton === 'gallery' && styles.activeButton,
              ]}
              onPress={() => handleOptionSelect('gallery')}
            >
              <View style={styles.buttonContent}>
                <Image
                  source={gallery?.Icon20}
                  style={[
                    styles.optionIcon,
                    activeButton === 'gallery' && styles.activeIcon,
                  ]}
                />
                <Text
                  style={[
                    styles.secondaryButtonText,
                    activeButton === 'gallery' && styles.activeText,
                  ]}
                >
                  From Gallery
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                activeButton === 'camera' && styles.activeButton,
              ]}
              onPress={() => handleOptionSelect('camera')}
            >
              <View style={styles.buttonContent}>
                <Image
                  source={cameral?.Icon133}
                  style={[
                    styles.optionIcon,
                    activeButton === 'camera' && styles.activeIcon,
                  ]}
                />
                <Text
                  style={[
                    styles.secondaryButtonText,
                    activeButton === 'camera' && styles.activeText,
                  ]}
                >
                  Use Camera
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
    fontSize: 18,
    fontFamily: 'Lexend-Medium',
    marginBottom: 25,
    color: 'black',
    alignSelf: 'center',
    marginTop: 30,
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginVertical: 10,
    fontFamily: 'Lexend-Medium',
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
    borderRadius: 30,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#555',
    fontFamily: 'Lexend-Medium',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 5,
    backgroundColor: 'white',
    borderRadius: 30,
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  primaryButtonText: {
    color: '#555',
    fontFamily: 'Lexend-Medium',
  },
  bottomModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomModalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
    alignItems: 'center',
    height: '30%',
  },
  secondaryButton: {
    width: '50%',
    paddingVertical: 15,
    backgroundColor: '#f59e0b',
    borderRadius: 40,
    alignItems: 'center',
    marginVertical: 5,
  },
  secondaryButtonText: {
    color: '#fff',
    fontFamily: 'Lexend-Medium',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButtonIcon: {
    width: 20,
    height: 20,
  },
  activeButton: {
    backgroundColor: 'orange',
  },
  activeText: {
    color: 'white',
  },
  activeIcon: {
    tintColor: 'white',
  },
});

export default PhotoMissingModal;

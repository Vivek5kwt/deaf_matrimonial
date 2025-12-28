import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import Step1 from '../ModalContent/steps/Step1';
import Step2 from '../ModalContent/steps/Step2';
import Step3 from '../ModalContent/steps/Step3';
import Step4 from '../ModalContent/steps/Step4';
import Step5 from '../ModalContent/steps/Step5';

import { arrow } from '../../utils/constants/icons/icon';

const { height: screenHeight } = Dimensions.get('window');

const ModalContent = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose(); // Close modal on the final step
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose(); // Go back to the previous screen if on the first step
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 onNext={handleNext} onPrevious={handlePrevious} />;
      case 2:
        return <Step2 onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <Step3 onNext={handleNext} onPrevious={handlePrevious} />;
      case 4: 
        return <Step4 onNext={handleNext} onPrevious={handlePrevious} />;
        case 5:
          return <Step5 onNext={handleNext} onPrevious={handlePrevious} />;
      default:
        return null;
    }
  };
  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
     <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {/* Arrow back button */}
          <TouchableOpacity style={styles.closeButton} onPress={handlePrevious}>
            <Image source={arrow?.Icon5} style={styles.closeText} />
          </TouchableOpacity>

          {/* Render the current step */}
          {renderStep()}
        </View>
      </View>
    </Modal>
    </ScrollView>

    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    height: screenHeight * 0.8,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    zIndex: 1,
    left: 28,
  },
  closeText: {
    height: 15,
    width: 18,
    color: '#888',
  },
});

export default ModalContent;

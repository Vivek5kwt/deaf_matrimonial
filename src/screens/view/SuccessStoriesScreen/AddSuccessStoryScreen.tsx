import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  SafeAreaView,
  ActivityIndicator,
  Modal
} from 'react-native';
import { submitSuccessStory } from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import Snackbar from 'react-native-snackbar';
import { arrow } from '../../../utils/constants/icons/icon';
import Lottie from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('screen');
const scale = size => {
  const newSize = size * (width / 375); // 375 is standard iPhone width
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
const AddSuccessStoryScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    bridename: '',
    brideid: '',
    groomname: '',
    groomid: '',
    marriagedate: '',
    engagement_date: '',
    successmessage: '',
    weddingphoto: null,
    status: '1'
  });
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Refs for Lottie animations
  const entryAnimationRef = useRef(null);
  const successAnimationRef = useRef(null);

  useEffect(() => {
    const isValid = form.bridename.trim() &&
      form.brideid.trim() &&
      form.groomname.trim() &&
      form.groomid.trim() &&
      form.marriagedate &&
      form.successmessage.trim() &&
      form.weddingphoto;
    setIsFormValid(!!isValid);
  }, [form]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('auth_token');
        if (!storedToken) {
          showSnackbar('Please login first', true);
          navigation.navigate('Login');
          return;
        }
        setToken(storedToken);
      } catch (error) {
        console.error('Token retrieval error:', error);
        showSnackbar('Authentication error', true);
        navigation.navigate('Login');
      }
    };
    getToken();

    // Play entry animation when component mounts
    entryAnimationRef.current?.play();
  }, [navigation]);

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 1024,
        height: 1024,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });
  
      if (image && image.path) {
        const fileName = image.filename || `photo_${Date.now()}.jpg`;
  
        setForm({
          ...form,
          weddingphoto: {
            uri: image.path,
            type: image.mime,
            name: fileName,
          }
        });
      }
    } catch (error) {
      if (error.code === 'E_PICKER_CANCELLED') {
        showSnackbar('Image selection cancelled');
      } else {
        console.error('ImagePicker Error:', error);
        showSnackbar('Error picking image');
      }
    }
  };
  

  const formatDateInput = (text, field) => {
    // Remove all non-digit characters
    let cleaned = text.replace(/\D/g, '');
    
    // Add slashes automatically as user types
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i === 2 || i === 4) {
        formatted += '-';
      }
      formatted += cleaned[i];
    }
    
    // Limit to 10 characters (DD-MM-YYYY)
    if (formatted.length > 10) {
      formatted = formatted.substring(0, 10);
    }
    
    // Update the appropriate field
    if (field === 'marriage') {
      setForm({ ...form, marriagedate: formatted });
    } else {
      setForm({ ...form, engagement_date: formatted });
    }
  };

  const validateDate = (dateString) => {
    if (!dateString) return false;
    
    const parts = dateString.split('-');
    if (parts.length !== 3) return false;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    // Basic validation
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    
    return true;
  };

  const showSnackbar = (message, isError = true) => {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: isError ? '#FF6B6B' : '#4BB543',
      textColor: '#FFFFFF',
      fontFamily: 'Lexend-Medium'
    });
  };

  const validateForm = () => {
    if (!form.bridename.trim()) {
      showSnackbar('Please enter bride name');
      return false;
    }
    if (!form.brideid.trim()) {
      showSnackbar('Please enter bride ID');
      return false;
    }
    if (!form.groomname.trim()) {
      showSnackbar('Please enter groom name');
      return false;
    }
    if (!form.groomid.trim()) {
      showSnackbar('Please enter groom ID');
      return false;
    }
    if (!form.marriagedate) {
      showSnackbar('Please enter marriage date');
      return false;
    }
    if (!validateDate(form.marriagedate)) {
      showSnackbar('Please enter a valid marriage date in DD-MM-YYYY format');
      return false;
    }
    if (form.engagement_date && !validateDate(form.engagement_date)) {
      showSnackbar('Please enter a valid engagement date in DD-MM-YYYY format');
      return false;
    }
    if (!form.successmessage.trim()) {
      showSnackbar('Please share your success message');
      return false;
    }
    if (!form.weddingphoto) {
      showSnackbar('Please upload a wedding photo');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !token) return;

    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append all form data
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'weddingphoto' && value !== null) {
          formData.append(key, value);
        }
      });

      // Append the image file
      if (form.weddingphoto) {
        formData.append('weddingphoto', {
          uri: form.weddingphoto.uri,
          type: form.weddingphoto.type,
          name: form.weddingphoto.name
        });
      }

      const response = await submitSuccessStory(form);

      if (response?.story_id) {
        setShowSuccessModal(true);
        successAnimationRef.current?.play();
      } else {
        const errorMessage = response?.message || response?.error || 'Something went wrong';
        showSnackbar(errorMessage);
      }
      
    } catch (error) {
      console.error('Submission error:', error);
    
      // Try to log full server response if it's not JSON
      try {
        const text = await error.response?.text();
        console.log('❗ Full Server Error Text:', text);
      } catch (e) {
        console.log('❗ Error parsing error text:', e);
      }
    
      let errorMessage = 'Failed to submit story';
    
      if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('JSON Parse error')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
    
      showSnackbar(errorMessage);
    }
     finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Entry Animation */}
      <Lottie
  ref={entryAnimationRef}
  source={require('../../../assets/animations/fullheart.json')}
  autoPlay={false}
  loop={false}
  speed={1.5}
  style={styles.entryAnimation}
/>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"       
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Image
                source={arrow?.Icon5}
                resizeMode="contain"
                style={styles.arrowStyle}
              />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Share Your Success Story</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>Inspire others with your love story</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Bride Section */}
          <Text style={styles.sectionTitle}>Bride Details</Text>
          <TextInput
            placeholder="Bride Name *"
            placeholderTextColor="#999"
            style={styles.input}
            value={form.bridename}
            onChangeText={t => setForm({ ...form, bridename: t })}
            returnKeyType="next"
          />
          <TextInput
            placeholder="Bride ID *"
            placeholderTextColor="#999"
            style={styles.input}
            value={form.brideid}
            onChangeText={t => setForm({ ...form, brideid: t })}
            returnKeyType="next"
          />

          {/* Groom Section */}
          <Text style={styles.sectionTitle}>Groom Details</Text>
          <TextInput
            placeholder="Groom Name *"
            placeholderTextColor="#999"
            style={styles.input}
            value={form.groomname}
            onChangeText={t => setForm({ ...form, groomname: t })}
            returnKeyType="next"
          />
          <TextInput
            placeholder="Groom ID *"
            placeholderTextColor="#999"
            style={styles.input}
            value={form.groomid}
            onChangeText={t => setForm({ ...form, groomid: t })}
            returnKeyType="next"
          />

          {/* Dates Section */}
          <Text style={styles.sectionTitle}>Important Dates</Text>
          <TextInput
            placeholder="Marriage Date (DD-MM-YYYY) *"
            placeholderTextColor="#999"
            style={styles.input}
            value={form.marriagedate}
            onChangeText={t => formatDateInput(t, 'marriage')}
            keyboardType="numeric"
            maxLength={10}
          />
          <TextInput
            placeholder="Engagement Date (DD-MM-YYYY)"
            placeholderTextColor="#999"
            style={styles.input}
            value={form.engagement_date}
            onChangeText={t => formatDateInput(t, 'engagement')}
            keyboardType="numeric"
            maxLength={10}
          />

          {/* Story Section */}
          <Text style={styles.sectionTitle}>Your Story</Text>
          <TextInput
            placeholder="Share your success message *"
            placeholderTextColor="#999"
            style={[styles.input, styles.multilineInput]}
            value={form.successmessage}
            onChangeText={t => setForm({ ...form, successmessage: t })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            blurOnSubmit={true}
          />

          {/* Photo Upload */}
          <Text style={styles.sectionTitle}>Wedding Photo *</Text>
          <View style={styles.photoUploadSection}>
            {!form.weddingphoto && (
           <TouchableOpacity
           style={styles.addPhotoButton}
           onPress={pickImage}
           disabled={isLoading}
           activeOpacity={0.7}
         >
           <Text style={styles.addPhotoText}>+ Add Photo</Text>
         </TouchableOpacity>
         
            )}

            {form.weddingphoto && (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{ uri: form.weddingphoto.uri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity onPress={pickImage} style={styles.changePhotoBtn}>
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isFormValid || isLoading) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid || isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Your Story</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Lottie
              ref={successAnimationRef}
              source={require('../../../assets/animations/SucsessHeart.json')}
              autoPlay={true}
              loop={true}
              style={styles.successAnimation}
            />
            <Text style={styles.modalTitle}>Thank You!</Text>
            <Text style={styles.modalText}>Your success story has been posted</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalClose}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
   

        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    paddingBottom: hp('4%'),
  },
  header: {
    padding: wp('3%'),
    paddingBottom: hp('1.5%'),
    backgroundColor: '#FF7E00',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#FF7E00',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  formContainer: {
    padding: wp('5%'),
  },
  sectionTitle: {
    fontSize: wp('4.2%'),
    fontFamily: 'Lexend-Medium',
    color: '#333',
    marginTop: hp('2%'),
    marginBottom: hp('1.2%'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('2%'),
    backgroundColor: '#fff',
    fontFamily: 'Lexend-Regular',
    padding: wp('4%'),
    fontSize: wp('4.2%'),
    marginBottom: hp('2%'),
  },
  multilineInput: {
    minHeight: hp('15%'),
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#FF7E00',
    padding: wp('3%'),
    marginHorizontal: wp('5%'),
    borderRadius: wp('7%'),
    alignItems: 'center',
    marginTop: hp('1.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  uploadButtonText: {
    color: '#fff',
    fontFamily: 'Lexend-Medium',
    fontSize: wp('4%'),
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  imagePreview: {
    width: wp('90%'),
    height: hp('30%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#FF7E00',
    borderRadius: wp('7%'),
    alignItems: 'center',
    marginTop: hp('1.5%'),
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('6%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'Lexend-Medium',
    fontSize: wp('4.5%'),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  backButton: {
    padding: wp('2%'),
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: wp('-10%'),
  },
  arrowStyle: {
    height: hp('2.5%'),
    width: wp('5%'),
    tintColor: 'white',
  },
  headerTitle: {
    fontSize: wp('5.5%'),
    fontFamily: 'Lexend-Medium',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: wp('3.5%'),
    fontFamily: 'Lexend-Medium',
    color: '#fff',
    textAlign: 'center',
    marginTop: hp('0.5%'),
  },
  entryAnimation: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('30%'), // Reduced height
    alignSelf: 'center',
    zIndex: 1,
    marginTop: hp('6%'),
  },  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: wp('85%'),
    backgroundColor: 'white',
    borderRadius: wp('4%'),
    padding: wp('6%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successAnimation: {
    width: wp('35%'),
    height: wp('35%'),
    marginBottom: hp('1.5%'),
  },
  modalTitle: {
    fontSize: wp('5.5%'),
    fontFamily: 'Lexend-Medium',
    color: '#FF7E00',
    marginBottom: hp('1.2%'),
  },
  modalText: {
    fontSize: wp('4%'),
    fontFamily: 'Lexend-Regular',
    color: '#555',
    textAlign: 'center',
    marginBottom: hp('2.5%'),
  },
  modalButton: {
    backgroundColor: '#FF7E00',
    paddingVertical: hp('1.6%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('6%'),
  },
  modalButtonText: {
    color: 'white',
    fontFamily: 'Lexend-Medium',
    fontSize: wp('4%'),
  },
  photoUploadSection: {
    alignItems: 'flex-start',
    marginBottom: hp('2.5%'),
  },
  addPhotoButton: {
    borderWidth: 1,
    borderColor: '#FF7E00',
    borderRadius: wp('5%'),
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('4%'),
    marginTop: hp('1%'),
  },
  addPhotoText: {
    fontSize: wp('3.5%'),
    fontFamily: 'Lexend-Medium',
    color: '#FF7E00',
  },
  changePhotoBtn: {
    marginTop: hp('1%'),
    alignSelf: 'flex-start',
  },
  changePhotoText: {
    fontSize: wp('3.5%'),
    fontFamily: 'Lexend-Medium',
    color: '#FF7E00',
    textDecorationLine: 'underline',
  },
});

export default AddSuccessStoryScreen;
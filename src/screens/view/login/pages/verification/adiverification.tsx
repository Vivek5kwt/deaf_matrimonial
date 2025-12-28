import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  ScrollView,
  Dimensions,
  BackHandler
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import styles2 from '../../../../../styles/verification/verificationstyles';
import { arrow, Id, camera, gallery } from '../../../../../utils/constants/icons/icon';
import { getUserData } from '../../../../../utils/constants/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

export const Screen15 = ({ navigation }) => {
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [matriId, setMatriId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const uploadInProgress = useRef(false);
  const isPickingImage = useRef(false);

  const imageSize = wp('40%');

  useEffect(() => {
    const fetchMatriId = async () => {
      try {
        const userData = await getUserData();
        if (!userData?.matriId) {
          Alert.alert('Error', 'Matri ID not found. Please restart the registration process.');
        } else {
          setMatriId(userData.matriId);
        }
      } catch (error) {
        Snackbar.show({
          text: 'Failed to load user data. Please try again.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
      }
    };

    fetchMatriId();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return isUploading;
    });

    const unsubscribe = navigation.addListener('focus', () => {
      uploadInProgress.current = false;
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation, isUploading]);

  const handleImagePick = async () => {
    if (isPickingImage.current) return;
    isPickingImage.current = true;

    try {
      const options = {
        width: 1024,
        height: 1024,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
        includeBase64: false,
        cropperToolbarTitle: 'Adjust Your Document',
        cropperToolbarColor: '#FF7E00',
        cropperActiveWidgetColor: '#FF7E00',
      };

      const image = await ImagePicker.openPicker(options);

      if (image?.path) {
        const selectedAsset = {
          uri: image.path,
          type: image.mime || 'image/jpeg',
          fileName: image.filename || `aadhaar_${Date.now()}.jpg`,
        };
        setAadhaarImage(selectedAsset);
      }
    } catch (error) {
      if (!error.message.includes('cancelled')) {
        Alert.alert('Error', 'Failed to select image. Please try again.');
      }
    } finally {
      isPickingImage.current = false;
    }
  };

  const removeImage = () => {
    setAadhaarImage(null);
    setRetryCount(0);
  };

  const handleUpload = async () => {
    if (!aadhaarImage || isUploading) return;

    const userData = await getUserData();
    if (!userData?.matriId) {
      Snackbar.show({
        text: 'Matri ID missing. Try again.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
      return;
    }

    uploadInProgress.current = true;
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('matri_id', userData.matriId);
    formData.append('aadhaar_card', {
      uri: aadhaarImage.uri,
      type: aadhaarImage.type,
      name: aadhaarImage.fileName,
    });

    try {
      const response = await axios.post('http://82.29.161.246:8002/api/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        },
        timeout: 30000,
      });

      if (response.status === 201) {
        Snackbar.show({
          text: 'Upload successful!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'green',
        });
        setAadhaarImage(null);
        navigation.navigate('Screen16');
      } else {
        throw new Error(`Unexpected status: ${response.status}`);
      }
    } catch (error) {
      if (retryCount < maxRetries) {
        setRetryCount(retryCount + 1);
        Snackbar.show({
          text: `Upload failed. Retrying (${retryCount + 1}/${maxRetries})...`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'orange',
        });
        setTimeout(handleUpload, 2000);
      } else {
        Snackbar.show({
          text: 'Upload failed. Please try again.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
        setIsUploading(false);
        setUploadProgress(0);
        uploadInProgress.current = false;
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}>
      <TouchableOpacity
        onPress={() => {
          if (!isUploading) navigation.goBack();
          else Snackbar.show({ text: 'Please wait for upload to finish.', backgroundColor: 'orange' });
        }}
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? hp('4%') : hp('2%'),
          left: wp('5%'),
          zIndex: 1,
        }}
      >
        <Image source={arrow?.Icon5} resizeMode="contain" style={[styles.arrowstyle, { width: wp('5%'), height: wp('5%') }]} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: wp('5%'),
          paddingBottom: hp('10%'),
          paddingTop: Platform.select({
            android: StatusBar.currentHeight + hp('5%'),
            ios: hp('10%')
          }),
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={Id?.Icon27} resizeMode="contain" style={[styles1.backimage, { width: wp('30%'), height: wp('30%') }]} />
        <Text style={[styles1.textt3, { marginTop: hp('2%'), fontSize: wp('5%') }]}>
          Upload your Aadhaar / UDID Card
        </Text>

        <Text style={[styles1.lightcolorB1, { fontSize: wp('3.5%'), textAlign: 'center', marginTop: hp('2%') }]}>
          We’ll use this document only for your ID verification.
        </Text>

        <View style={{ width: '100%', marginTop: hp('4%') }}>
          <Text style={[styles2.labelText, { marginBottom: hp('1%') }]}>Document</Text>
          <TouchableOpacity
            style={[
              styles2.imageBox,
              { height: imageSize, borderColor: aadhaarImage ? '#FF7E00' : '#ddd' }
            ]}
            onPress={handleImagePick}
          >
            {aadhaarImage ? (
              <View style={{ width: '100%', height: '100%' }}>
                <Image source={{ uri: aadhaarImage.uri }} style={{ width: '100%', height: '100%', borderRadius: wp('2%') }} resizeMode="cover" />
                <TouchableOpacity style={styles2.removeButton} onPress={removeImage}>
                  <Text style={styles2.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles2.uploadPrompt}>
                <Image source={gallery?.Icon20} style={{ width: wp('8%'), height: wp('8%') }} />
                <Text style={styles2.uploadText}>Tap to upload your Aadhaar/UDID</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={[
            styles.emgaborder132,
            {
              backgroundColor: aadhaarImage ? '#FF7E00' : '#ccc',
              marginTop: hp('4%'),
              opacity: !aadhaarImage || isUploading ? 0.6 : 1,
            },
          ]}
          onPress={handleUpload}
          disabled={!aadhaarImage || isUploading}
          activeOpacity={0.7}
        >
          {isUploading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={[styles.modalText11, { marginLeft: wp('2%') }]}>Uploading {uploadProgress}%...</Text>
            </View>
          ) : (
            <Text style={styles.modalText11}>
              {retryCount > 0 ? `Retry Upload (${retryCount}/${maxRetries})` : 'Upload'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {isUploading && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: '#fff', fontSize: wp('4%'), marginTop: hp('2%') }}>
            Uploading... {uploadProgress}%
          </Text>
          <Text style={{ color: '#fff', fontSize: wp('3.2%'), marginTop: hp('1%'), textAlign: 'center' }}>
            Please don’t close or minimize the app
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Screen15;

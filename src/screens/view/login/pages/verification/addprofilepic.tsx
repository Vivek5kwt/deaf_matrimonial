import React, { useState } from 'react';
import { View, StatusBar, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import { arrow, usercomp, backr, gallery, camera, add, bin } from '../../../../../utils/constants/icons/icon';
import styles2 from '../../../../../styles/verification/verificationstyles';

const Screen20 = (props: any) => {
  const [selectedImage, setSelectedImage] = useState(usercomp?.Icon54); 
  const [isPhotoAdded, setIsPhotoAdded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleImageSelection = (imageUri: string) => {
    setIsUploading(true);
    setUploadError('');
    
    // Simulate upload process - replace with your actual upload logic
    setTimeout(() => {
      try {
        // Your actual upload API call would go here
        console.log('Uploading image:', imageUri);
        
        // On successful upload
        setSelectedImage({ uri: imageUri });
        setIsPhotoAdded(true);
        setIsUploading(false);
      } catch (error) {
        console.error('Upload failed:', error);
        // setUploadError('Failed to upload image. Please try again.');
        setIsUploading(false);
      }
    }, 1000);
  };

  const handleAddImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1, // Set to 1 if you only want single selection
      },
      (response) => {
        if (!response.didCancel && !response.errorCode && response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          if (imageUri) {
            handleImageSelection(imageUri);
          }
        } else if (response.errorCode) {
          setUploadError('Error selecting image: ' + response.errorMessage);
        }
      }
    );
  };

  const handleDeleteImage = () => {
    setSelectedImage(usercomp?.Icon54); 
    setIsPhotoAdded(false);
    setUploadError('');
  };

  const handleUseCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (!response.didCancel && !response.errorCode && response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          if (imageUri) {
            handleImageSelection(imageUri);
          }
        } else if (response.errorCode) {
          setUploadError('Error capturing image: ' + response.errorMessage);
        }
      }
    );
  };

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <View style={{ marginHorizontal: 20, marginTop: '2%' }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
        </TouchableOpacity>

        <View style={{ justifyContent: 'center', alignSelf: 'center', marginTop: '30%' }}>
          <Text style={styles1.textt3}>Profile is incomplete</Text>
          <Text style={styles1.textt2}>without Photos. Add now!</Text>
          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <Text style={styles1.lightcolor}>90% of members only select Matches with Photos</Text>
          </View>
        </View>

        <View style={{ marginTop: 30, alignItems: 'center' }}>
          {isUploading ? (
            <View style={[styles1.backimage, { borderRadius: 75, width: 120, height: 120, justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <Image
              source={selectedImage}
              resizeMode="cover"
              style={[
                styles1.backimage,
                { borderRadius: 75, width: 120, height: 120 }, 
              ]}
            />
          )}

          {!isPhotoAdded ? (
            <TouchableOpacity onPress={handleAddImage} style={{ position: 'absolute', bottom: -10, right: '45%' }}>
              <Image source={add?.Icon23} style={styles1.addimage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleDeleteImage} style={{ position: 'absolute', bottom: -10, right: '45%' }}>
              <Image source={bin?.Icon31} style={styles1.addimage} />
            </TouchableOpacity>
          )}
        </View>

        {uploadError ? (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{uploadError}</Text>
        ) : null}

        <TouchableOpacity 
          onPress={handleAddImage} 
          style={styles.addpic}
          disabled={isUploading}
        >
          <Image source={gallery?.Icon20} style={styles2.gallerystyle} />
          <Text style={styles.modalText1}>Add from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleUseCamera}
          style={{ flexDirection: 'row', alignContent: 'center', alignSelf: 'center', marginTop: 20 }}
          disabled={isUploading}
        >
          <Image source={camera?.Icon21} style={styles2.gallerystyle} />
          <Text style={styles.modalTextt}>Use Camera</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 40,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => props.navigation.navigate('Screen26')}
        disabled={isUploading}
      >
        <Text style={styles1.lightcolorB}>Add Photos Later </Text>
        <Image source={backr?.Icon25} style={styles2.Ppicon} />
      </TouchableOpacity>
    </View>
  );
};

export default Screen20;
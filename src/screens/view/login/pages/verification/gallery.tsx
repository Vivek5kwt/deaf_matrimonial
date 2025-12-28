import React, { useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import styles from '../../../../../styles/onboadings/styles';
import styles1 from '../../../../../styles/onboadings/loginpages/styles';
import styles2 from '../../../../../styles/verification/verificationstyles';

import {
  arrow,
  DM,
  gallery,
  camera,
  usercomp,
  PP,
  backr,
} from '../../../../../utils/constants/icons/icon';
import { getUserData, storeUserData } from '../../../../../utils/constants/storage';
import ImageResizer from '@bam.tech/react-native-image-resizer';

const Screen13 = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matriId, setMatriId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatriId = async () => {
      try {
        const userData = await getUserData();
        if (!userData || !userData.matriId) {
          Alert.alert('Error', 'Matri ID not found. Please restart the registration process.');
        } else {
          setMatriId(userData.matriId);
        }
      } catch (error) {
        console.error('Error fetching Matri ID:', error);
      }
    };

    fetchMatriId();
  }, []);

  const compressAndResizeImage = async (uri: string) => {
    try {
      const response = await ImageResizer.createResizedImage(uri, 800, 800, 'JPEG', 70, 0, null, false);
      return response.uri;
    } catch (error) {
      console.error('Image compression error:', error);
      return uri;
    }
  };

  const handleImageSelection = async (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }
  
    if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Snackbar.show({
        text: 'Error selecting image: ' + response.errorMessage,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#FF0000',
      });
      return;
    }
  
    if (!response.assets || response.assets.length === 0) {
      console.log('No assets found');
      return;
    }
  
    const originalUri = response.assets[0].uri;
    const fileName = response.assets[0].fileName || `profile_${Date.now()}.jpg`;
    const type = response.assets[0].type || 'image/jpeg';
  
    try {
      setLoading(true); // Lock UI here
  
      const processedUri = await compressAndResizeImage(originalUri);
  
      if (!matriId) {
        Alert.alert('Error', 'Matri ID is missing. Please try again.');
        return;
      }
  
      // Wait for upload to succeed before changing state
      const imageUrl = await uploadProfileImage(processedUri, fileName, type);
  
      if (imageUrl) {
        setSelectedImage({ uri: processedUri });
        await AsyncStorage.setItem('photo1', processedUri);
  
        // Save full data
        await storeUserData({
          profilePicture: imageUrl,
          localProfilePicture: processedUri,
          matriId: matriId,
        });
  
        Snackbar.show({
          text: 'Profile picture uploaded successfully!',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: '#4CAF50',
        });
  
        navigation.navigate('Screen12', { refreshedImage: imageUrl });
      }
    } catch (error) {
      console.error('Image processing error:', error);
      Snackbar.show({
        text: 'Error processing image. Please try again.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#FF0000',
      });
    } finally {
      setLoading(false); // Unlock UI only after upload is done
    }
  };
  
  const uploadProfileImage = async (imageUri, fileName, type) => {
    const formData = new FormData();
    formData.append('photo1', {
      uri: imageUri,
      name: fileName,
      type: type,
    });
    formData.append('matri_id', matriId);
  
    let attempt = 0;
    const maxAttempts = 10;
  
    while (attempt < maxAttempts) {
      try {
        const response = await fetch('http://82.29.161.246:8002/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
  
        const result = await response.json();
        console.log('Upload Response:', result);
  
        if (response.ok) {
          return result.photo1
            ? `http://82.29.161.246:8002/${result.photo1}`
            : imageUri;
        } else {
          console.log(`Server responded with error: ${result.message}`);
        }
      } catch (error) {
        console.log(`Network error on attempt ${attempt + 1}:`, error.message);
      }
  
      attempt++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retrying
    }
  
    // If all retries fail, just keep waiting infinitely
    return await uploadProfileImage(imageUri, fileName, type); // Infinite retry
  };
  
  

  

  const handleAddImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200,
      selectionLimit: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, handleImageSelection).catch((error) => {
      console.log('LaunchImageLibrary error:', error);
      Snackbar.show({
        text: 'Failed to open gallery. Please check permissions.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#FF0000',
      });
    });
  };

  const handleUseCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
      includeBase64: false,
    };

    launchCamera(options, handleImageSelection).catch((error) => {
      console.log('LaunchCamera error:', error);
      Snackbar.show({
        text: 'Failed to open camera. Please check permissions.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#FF0000',
      });
    });
  };

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>

      <View style={{ marginHorizontal: wp('5%')}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={arrow?.Icon5} resizeMode="stretch" style={styles.arrowstyle} />
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: hp('2%') }}>
          <Image source={DM?.Icon18} resizeMode="stretch" style={styles1.profileimageDM} />
        </TouchableOpacity>

        <View style={styles.roundImageContainer}>
          {selectedImage ? (
            <Image source={selectedImage} style={styles.roundImage} />
          ) : (
            <Image source={usercomp?.Icon54} style={styles.roundImage} />
          )}
        </View>

        {loading && (
          <View style={{ marginVertical: hp('2%'),alignSelf:"center" }}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles1.lightcolorB}>Processing image...</Text>
          </View>
        )}

        <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
          <Text style={styles1.textt3}>Add your Photo</Text>
          <Text style={styles1.textt2}>to complete your Profile</Text>
          <View style={{ flexDirection: 'row', marginVertical: hp('1.5%') }}>
            <Text style={styles1.lightcolor}>Your photos are 100% </Text>
            <TouchableOpacity>
              <Text style={styles1.lightcolor2}>safe and secure</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleAddImage} style={styles.addpic} disabled={loading}>
          <Image source={gallery?.Icon20} style={styles2.gallerystyle} />
          <Text style={styles.modalText11}>Add from Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUseCamera}
          style={{ flexDirection: 'row', alignSelf: 'center', marginTop: hp('2.5%') }}
          disabled={loading}
        >
          <Image source={camera?.Icon21} style={styles2.gallerystyle} />
          <Text style={styles.modalTextt}>Use Camera</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Screen12')}
        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: hp('1%') }}
        disabled={loading}
      >
        <Text style={styles1.lightcolorB}>Add Photos Later</Text>
        <Image source={backr?.Icon25} style={styles2.Ppicon} />
      </TouchableOpacity>

      <View style={{
        backgroundColor: '#F9F9FB',
        paddingVertical: hp('4%'),
        alignSelf: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 0,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={PP?.Icon22} style={styles2.Ppicon} />
          <Text style={styles1.lightcolorB}>
            Photo Privacy controls are available in Settings.
          </Text>
        </View>
        <Text style={styles1.lightcolorBB}>For added security, screenshots are also disabled.</Text>
      </View>
    </View>
    </SafeAreaView>
  );
};

export default Screen13;

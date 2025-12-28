import AsyncStorage from '@react-native-async-storage/async-storage';

// User Data Store Karein (Matri ID, Name, Email, Profile Picture)
export const storeUserData = async (userData,token = null) => {
  try {
    if (userData && userData.matriId) {
      await AsyncStorage.setItem('matri_id', userData.matriId);
    }
    if (userData.firstName) {
      await AsyncStorage.setItem('firstName', userData.firstName);
    }
    if (userData.lastName) {
      await AsyncStorage.setItem('lastName', userData.lastName);
    }
    if (userData.email) {
      await AsyncStorage.setItem('email', userData.email);
    }
    if (userData?.indexId) {
      await AsyncStorage.setItem('index_id', userData.indexId.toString());
    }    
    if (userData.profilePicture) {
      await AsyncStorage.setItem('profile_picture', userData.profilePicture);
    }
    if (userData.mobileNumber) {
      await AsyncStorage.setItem('mobile_number', userData.mobileNumber);
    }
    if (token) {
      await AsyncStorage.setItem('auth_token', token.toString());  // ✅ Fix for undefined/null token
    }
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

// User Data Retrieve Karein
export const getUserData = async () => {
  try {
    const matriId = await AsyncStorage.getItem('matri_id');
    const firstName = await AsyncStorage.getItem('firstName');
    const lastName = await AsyncStorage.getItem('lastName');
    const authToken = (await AsyncStorage.getItem('auth_token')) || null;
    const email = await AsyncStorage.getItem('email');
    const profilePicture = await AsyncStorage.getItem('profile_picture');
    const indexId = await AsyncStorage.getItem('index_id');
    const mobileNumber = await AsyncStorage.getItem('mobile_number');


    const userData = { matriId, firstName,mobileNumber, email,lastName,indexId ,profilePicture ,authToken};
    console.log("Retrieved User Data:", userData);
    
    return userData;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

// User Data Remove Karein (Logout ya Account Delete ke liye)
export const removeUserData = async () => {
  try {
    await AsyncStorage.multiRemove(['matri_id','firstName','lastName', 'mobileNumber','email', 'profile_picture','auth_token','index_id']);
    console.log("User data removed");
  } catch (error) {
    console.error("Error removing user data:", error);
  }
};

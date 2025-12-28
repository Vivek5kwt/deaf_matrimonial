import ApiEndpoints from './ApiEndpoints';
import { get, postFormData, postFormUrlEncoded } from './apiServices';
// 1. Get settings data
export const getSettingsData = async () => {
  return await get(ApiEndpoints.SITE_SETTINGS);
};

// 2. Get field settings data
export const getFieldSettingsData = async () => {
  return await get(ApiEndpoints.FIELD_SETTINGS);
};

// 3. Get height data
export const getHeightData = async () => {
  return await get(ApiEndpoints.HEIGHT_DATA);
};

// 4. Check user status
export const checkUserStatus = async (matri_id) => {
  return await postFormUrlEncoded(ApiEndpoints.CHECK_USER_STATUS, { matri_id });
};

// 5. Send OTP
export const sendOtp = async (user_id) => {
  return await postFormUrlEncoded(ApiEndpoints.SEND_OTP, { user_id });
};

// 6. Post update profile with an image
export const postUpdateProfile = async (user_id, image) => {
  const formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('image', {
    uri: image.uri,
    type: image.type,
    name: image.fileName,
  });

  return await postFormData(ApiEndpoints.POST_UPDATE_PROFILE, formData);
};

// 7. Post ID update profile
export const postIdUpdateProfile = async (user_id, image) => {
  const formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('image', {
    uri: image.uri,
    type: image.type,
    name: image.fileName,
  });

  return await postFormData(ApiEndpoints.POST_ID_UPDATE_PROFILE, formData);
};

// 8. Upload a success story
export const addSuccessStory = async (storyData, image) => {
  const formData = new FormData();
  Object.keys(storyData).forEach((key) => {
    formData.append(key, storyData[key]);
  });
  if (image) {
    formData.append('image', {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });
  }

  return await postFormData(ApiEndpoints.SUCCESS_STORY, formData);
};

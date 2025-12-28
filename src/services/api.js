import { getUserData } from "../utils/constants/storage";



// ✅ GET Function: Fetch Success Stories
export const fetchSuccessStories = async () => {
  const userData = await getUserData();
  const token = userData?.authToken;

  const response = await fetch('http://82.29.161.246:8002/api/success-stories', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.json();
};

// ✅ POST Function: Submit Success Story
export const submitSuccessStory = async (form) => {
  const userData = await getUserData();
  const token = userData?.authToken;

  const formData = new FormData();
  formData.append('weddingphoto_type', 'photo');
  formData.append('brideid', form.brideid);
  formData.append('bridename', form.brideName);  // Changed from brideName to bridename
  formData.append('groomid', form.groomid);
  formData.append('groomname', form.groomName);  // Changed from groomName to groomname
  formData.append('marriagedate', form.marriagedate);
  formData.append('engagement_date', form.engagement_date);
  formData.append('successmessage', form.successmessage);

  if (form.weddingphoto) {
    formData.append('weddingphoto', {
      uri: form.weddingphoto.uri,
      type: form.weddingphoto.type || 'image/jpeg',
      name: form.weddingphoto.name || `photo_${Date.now()}.jpg`,
    });
  }

  try {
    const response = await fetch('http://82.29.161.246:8002/api/success-stories', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  
    const contentType = response.headers.get('Content-Type');
    const status = response.status;
    const rawText = await response.text();
  
    console.log('📡 Server Status:', status);
    console.log('📄 Content-Type:', contentType);
    console.log('📃 Raw Response Text:', rawText);
  
    if (!response.ok) {
      console.error('❗ Server responded with an error status:', status);
      throw new Error(`HTTP ${status} - ${rawText}`);
    }
  
    if (contentType && contentType.includes('application/json')) {
      return JSON.parse(rawText);
    } else {
      console.error('❌ Not a JSON response:', rawText);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('❌ Submission error:', error);
    throw error;
  }
};


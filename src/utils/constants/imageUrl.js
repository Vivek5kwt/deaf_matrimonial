const API_BASE_URL = 'http://82.29.161.246:8002';
const WEB_IMAGE_BASE_URL = 'http://82.29.161.246:8001/my_photos';

export const getProfileImageUrl = (photo1: string): string | null => {
  if (!photo1) return null;

  // Web image: plain filename like "abc.jpg"
  if (!photo1.includes('/') && photo1.endsWith('.jpg')) {
    return `${WEB_IMAGE_BASE_URL}/${photo1}`;
  }

  // App image: relative path
  return `${API_BASE_URL}/${photo1}`;
};

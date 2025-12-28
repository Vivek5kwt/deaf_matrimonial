import axios from 'axios';
import ApiEndpoints from './ApiEndpoints';

// Base URL for all requests
const BASE_URL = 'https://your-base-url.com/';

// Create an instance of Axios
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle GET requests
export const get = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to handle POST requests with form data
export const postFormData = async (endpoint, formData) => {
  try {
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to handle POST requests with x-www-form-urlencoded data
export const postFormUrlEncoded = async (endpoint, data) => {
  const urlEncodedData = new URLSearchParams(data).toString();

  try {
    const response = await apiClient.post(endpoint, urlEncodedData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

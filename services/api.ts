import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});





client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('tkn');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('tkn');
    }
    return Promise.reject(error);
  }
);

export default client;
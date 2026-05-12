import client from './api';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const R = {
  in:  '/auth/login',
  up:  '/auth/register',
};

export const iniciarSesion = async (email: string, password: string) => {
  const { data } = await client.post(R.in, { email, password });
  await SecureStore.setItemAsync('tkn', data.access_token);
  await SecureStore.setItemAsync('usr', JSON.stringify(data));
  return data;
};

export const crearCuenta = async (name: string, email: string, password: string) => {
  const { data } = await client.post(R.up, { name, email, password });
  return data;
};

export const cerrarSesion = async () => {
  await SecureStore.deleteItemAsync('tkn');
  await SecureStore.deleteItemAsync('usr');
  await AsyncStorage.removeItem('aqua_device_ip');   // ← agrega
  await AsyncStorage.removeItem('aqua_device_id');   // ← agrega
};

export const obtenerToken = async () => {
  return await SecureStore.getItemAsync('tkn');
};

export const obtenerUsuario = async () => {
  const usr = await SecureStore.getItemAsync('usr');
  return usr ? JSON.parse(usr) : null;
};

export const obtenerPerfil = async () => {
  const { data } = await client.get('/users/me');
  return data;
};

export const actualizarNombre = async (nombre: string) => {
  const { data } = await client.put('/users/me', { name: nombre });
  return data;
};
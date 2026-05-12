// services/deviceService.ts
import client from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'aqua_device_id';

export const registrarDispositivo = async (ip: string) => {
  // Verificar si ya hay un dispositivo registrado
  const savedId = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (savedId) return JSON.parse(savedId);

  const { data } = await client.post('/devices/', {
    name: 'AquaHome',
    location: ip,
  });

  await AsyncStorage.setItem(DEVICE_ID_KEY, JSON.stringify(data));
  return data;
};

export const obtenerDispositivo = async () => {
  const saved = await AsyncStorage.getItem(DEVICE_ID_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const obtenerEstadoAgua = async (deviceId: number) => {
  const { data } = await client.get(`/readings/device/${deviceId}/status`);
  return data;
};

export const obtenerLecturas = async (deviceId: number) => {
  const { data } = await client.get(`/readings/device/${deviceId}?limit=10`);
  return data;
};

export const verificarConexionEsp32 = async (): Promise<boolean> => {
  try {
    const ip = await AsyncStorage.getItem('aqua_device_ip');
    if (!ip) return false;
    
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    
    const res = await fetch(`http://${ip}/identify`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timer);
    const json = await res.json();
    return json?.device === 'aqua';
  } catch {
    return false;
  }
};
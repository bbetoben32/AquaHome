import client from './api';
import { obtenerDispositivo } from './deviceService';

export const obtenerMantenimiento = async () => {
  const dispositivo = await obtenerDispositivo();
  if (!dispositivo) return null;
  const { data } = await client.get(`/maintenance/device/${dispositivo.id}`);
  return data;
};

export const registrarMantenimiento = async (fecha: string, notas?: string) => {
  const dispositivo = await obtenerDispositivo();
  if (!dispositivo) return null;
  const { data } = await client.post(`/maintenance/device/${dispositivo.id}`, {
    fecha,
    notas,
  });
  return data;
};
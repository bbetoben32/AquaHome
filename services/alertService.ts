import client from './api';
import { obtenerDispositivo } from './deviceService';

export const obtenerAlertasHoy = async () => {
  const dispositivo = await obtenerDispositivo();
  if (!dispositivo) return [];
  const { data } = await client.get(`/alerts/device/${dispositivo.id}/today`);
  return data;
};

export const obtenerAlertasSemana = async () => {
  const dispositivo = await obtenerDispositivo();
  if (!dispositivo) return [];
  const { data } = await client.get(`/alerts/device/${dispositivo.id}/week`);
  return data;
};

export const eliminarAlerta = async (alertId: number) => {
  await client.delete(`/alerts/${alertId}`);
};
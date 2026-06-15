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

export const obtenerAlertasHoyNoLeidas = async () => {
  const dispositivo = await obtenerDispositivo();
  if (!dispositivo) return [];
  const { data } = await client.get(`/alerts/device/${dispositivo.id}/today/unread`);
  return data;
};

export const obtenerAlertasSemanaNoLeidas = async () => {
  const dispositivo = await obtenerDispositivo();
  if (!dispositivo) return [];
  const { data } = await client.get(`/alerts/device/${dispositivo.id}/week/unread`);
  return data;
};

export const marcarAlertaLeida = async (alertId: number) => {
  await client.patch(`/alerts/${alertId}/leer`);
};

export const eliminarAlerta = async (alertId: number) => {
  await client.delete(`/alerts/${alertId}`);
};
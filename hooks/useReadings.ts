import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerToken } from '../services/authService';
import { obtenerDispositivo, obtenerEstadoAgua, obtenerLecturas } from '../services/deviceService';
import { enviarNotificacionLocal, registrarNotificaciones } from './useNotifications';

export function useReadings() {
  const [lecturas, setLecturas] = useState<any[]>([]);
  const [estado, setEstado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let mounted = true;
    registrarNotificaciones();

    const iniciar = async () => {
      try {
        const [token, dispositivo] = await Promise.all([
          obtenerToken(),
          obtenerDispositivo(),
        ]);

        if (!token || !dispositivo) return;

        const [lecturasIniciales, estadoInicial] = await Promise.all([
          obtenerLecturas(dispositivo.id),
          obtenerEstadoAgua(dispositivo.id).catch(() => null),
        ]);

        if (mounted) {
          setLecturas(lecturasIniciales);
          setEstado(estadoInicial);
          setLoading(false);
        }

        const wsUrl = process.env.EXPO_PUBLIC_API!
          .replace('http', 'ws')
          .replace('/api/v1', '');
        const ws = new WebSocket(`${wsUrl}/ws/device/${dispositivo.id}`);

        ws.onopen = () => {
          ws.send(JSON.stringify({ token }));
        };

        ws.onmessage = async (e) => {
          const data = JSON.parse(e.data);

          if (data.event === 'nueva_lectura') {
            const nueva = {
              ph: data.ph,
              temperature: data.temperature,
              turbidity: data.turbidity,
              tds: data.tds,
              timestamp: data.timestamp,
              device_id: data.device_id,
            };
            if (mounted) {
              setLecturas(prev => [nueva, ...prev].slice(0, 50));
              setEstado({ status: data.status, alerts: data.alerts });
            }
          }

          if (data.event === 'nueva_alerta') {
            const notifActivas = await AsyncStorage.getItem('notificaciones_activas');
            if (notifActivas !== 'false') {
              for (const alerta of data.alertas) {
                await enviarNotificacionLocal(
                  '⚠️ Alerta de calidad del agua',
                  `${alerta.mensaje} — ${alerta.estado}`
                );
              }
            }
          }
        };

        ws.onclose = () => {
          setTimeout(() => {
            if (mounted) iniciar();
          }, 5000);
        };

        ws.onerror = (e) => {
          console.log('WebSocket readings error:', e);
        };

      } catch (e) {
        console.log('Error iniciando readings:', e);
        if (mounted) setLoading(false);
      }
    };

    iniciar();

    return () => {
      mounted = false;
      wsRef.current?.close();
    };
  }, []);

  const ultimaLectura = lecturas[0] ?? null;
  return { loading, lecturas, estado, ultimaLectura };
}
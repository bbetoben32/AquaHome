import { useState, useEffect, useRef } from 'react';
import { obtenerToken } from '../services/authService';
import { obtenerDispositivo } from '../services/deviceService';

export function useDeviceStatus() {
  const [conectado, setConectado] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let mounted = true;

    const conectar = async () => {
      try {
        const [token, dispositivo] = await Promise.all([
          obtenerToken(),
          obtenerDispositivo(),
        ]);

        if (!token || !dispositivo) {
          console.log('Sin token o dispositivo:', { token, dispositivo });
          return;
        }

        console.log('Conectando WebSocket a dispositivo:', dispositivo.id);

        const ws = new WebSocket(
          `ws://192.168.1.4:8000/ws/device/${dispositivo.id}`
        );
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket onopen - enviando token');
          ws.send(JSON.stringify({ token }));
        };

        ws.onmessage = (e) => {
          console.log('mensaje raw:', e.data);
          const data = JSON.parse(e.data);

          if (data.event === 'authenticated') {
            console.log('autenticado, is_active:', data.is_active);
            if (mounted) setConectado(data.is_active);
          }

          if (data.event === 'status') {
            console.log('status:', data.is_active);
            if (mounted) setConectado(data.is_active);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket cerrado, reconectando en 5s...');
          if (mounted) setConectado(false);
          setTimeout(() => {
            if (mounted) conectar();
          }, 5000);
        };

        ws.onerror = (e) => {
          console.log('WebSocket error:', e);
        };

      } catch (e) {
        console.log('Error conectando WebSocket:', e);
      }
    };

    conectar();

    return () => {
      mounted = false;
      wsRef.current?.close();
    };
  }, []);

  return { conectado };
}
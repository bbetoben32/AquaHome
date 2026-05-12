import { useState, useEffect, useRef } from 'react';
import { obtenerAlertasHoy, obtenerAlertasSemana, eliminarAlerta } from '../services/alertService';
import { obtenerToken } from '../services/authService';
import { obtenerDispositivo } from '../services/deviceService';

export function useAlertas(filtro: 'hoy' | 'semanal') {
  const [alertas, setAlertas]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const wsRef                   = useRef<WebSocket | null>(null);

  useEffect(() => {
    let mounted = true;

    const cargar = async () => {
      try {
        const data = filtro === 'hoy'
          ? await obtenerAlertasHoy()
          : await obtenerAlertasSemana();
        if (mounted) setAlertas(data);
      } catch (e) {
        console.log('Error cargando alertas:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    cargar();
  }, [filtro]);

  useEffect(() => {
    let mounted = true;

    const conectarWs = async () => {
      const [token, dispositivo] = await Promise.all([
        obtenerToken(),
        obtenerDispositivo(),
      ]);
      if (!token || !dispositivo) return;

      const ws = new WebSocket(
        `ws://192.168.1.4:8000/ws/device/${dispositivo.id}`
      );
      wsRef.current = ws;

      ws.onopen = () => ws.send(JSON.stringify({ token }));

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.event === 'nueva_alerta' && filtro === 'hoy') {
            const alertasFormateadas = data.alertas.map((a: any) => ({
            ...a,
            created_at: a.hora || a.created_at || new Date().toISOString(), // ← normaliza el campo
            }));
            if (mounted) {
            setAlertas(prev => [...alertasFormateadas, ...prev]);
            }
        }
    };

      ws.onclose = () => {
        setTimeout(() => { if (mounted) conectarWs(); }, 5000);
      };
    };

    conectarWs();

    return () => {
      mounted = false;
      wsRef.current?.close();
    };
  }, [filtro]);

  const eliminar = async (id: string) => {
    try {
      await eliminarAlerta(Number(id));
      setAlertas(prev => prev.filter(a => a.id !== Number(id)));
    } catch (e) {
      console.log('Error eliminando alerta:', e);
    }
  };

  return { alertas, loading, eliminar };
}
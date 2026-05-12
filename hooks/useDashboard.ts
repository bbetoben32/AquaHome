// hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { obtenerDispositivo, obtenerEstadoAgua, obtenerLecturas } from '../services/deviceService';

export function useDashboard() {
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [dispositivo, setDispositivo] = useState<any>(null);
  const [estado, setEstado]         = useState<any>(null);
  const [lecturas, setLecturas]     = useState<any[]>([]);

  const cargar = async () => {
    try {
      setLoading(true);
      setError(null);

      const dev = await obtenerDispositivo();
      if (!dev) {
        setError('No hay dispositivo vinculado');
        return;
      }
      setDispositivo(dev);

      const [estadoData, lecturasData] = await Promise.all([
        obtenerEstadoAgua(dev.id),
        obtenerLecturas(dev.id),
      ]);

      setEstado(estadoData);
      setLecturas(lecturasData);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return { loading, error, dispositivo, estado, lecturas, recargar: cargar };
}
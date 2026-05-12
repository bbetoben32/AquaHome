import { useState, useEffect } from 'react';
import { obtenerPerfil } from '../services/authService';
import { obtenerDispositivo } from '../services/deviceService';
import { useDeviceStatus } from './useDeviceStatus';

export function usePerfil() {
  const [loading, setLoading]         = useState(true);
  const [nombre, setNombre]           = useState('');
  const [correo, setCorreo]           = useState('');
  const [dispositivo, setDispositivo] = useState<any>(null);
  const { conectado }                 = useDeviceStatus();

  useEffect(() => {
    const cargar = async () => {
      try {
        const [perfil, dev] = await Promise.all([
          obtenerPerfil(),
          obtenerDispositivo(),
        ]);
        setNombre(perfil.name);
        setCorreo(perfil.email);
        setDispositivo(dev);
      } catch (e) {
        console.log('Error cargando perfil:', e);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return { loading, nombre, correo, dispositivo, conectado };
}
import { useState, useEffect } from 'react';
import { obtenerMantenimiento, registrarMantenimiento } from '../services/maintenanceService';

export function useMantenimiento() {
  const [loading, setLoading]             = useState(true);
  const [diasRestantes, setDiasRestantes] = useState(0);
  const [totalDias, setTotalDias]         = useState(150);
  const [alertasCriticas, setAlertasCriticas] = useState(0);
  const [reduccionDias, setReduccionDias] = useState(0);
  const [ultimoMantenimiento, setUltimoMantenimiento] = useState<string | null>(null);

    const cargar = async () => {
    try {
        console.log('Cargando mantenimiento...');
        const data = await obtenerMantenimiento();
        console.log('Data mantenimiento:', JSON.stringify(data));
        if (data) {
        setDiasRestantes(data.dias_restantes);
        setTotalDias(data.total_dias);
        setAlertasCriticas(data.alertas_criticas);
        setReduccionDias(data.reduccion_dias);
        setUltimoMantenimiento(data.ultimo_mantenimiento);
        }
    } catch (e) {
        console.log('Error cargando mantenimiento:', e);
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => {
    cargar();
  }, []);

  const registrar = async (fecha: Date, notas?: string) => {
    try {
      const data = await registrarMantenimiento(fecha.toISOString(), notas);
      if (data) {
        setDiasRestantes(data.dias_restantes);
        setTotalDias(data.total_dias);
        setAlertasCriticas(data.alertas_criticas);
        setReduccionDias(data.reduccion_dias);
        setUltimoMantenimiento(data.ultimo_mantenimiento);
      }
    } catch (e) {
      console.log('Error registrando mantenimiento:', e);
    }
  };

  return { loading, diasRestantes, totalDias, alertasCriticas, reduccionDias, ultimoMantenimiento, registrar };
}
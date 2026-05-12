import { useState, useEffect } from 'react';
import { obtenerDispositivo } from '../services/deviceService';
import client from '../services/api';

type Periodo = 'dia' | 'mes' | 'año';

// ── Fuera del hook ─────────────────────────────────────────────
function promedio(valores: (number | null)[]): number {
  const validos = valores.filter(v => v !== null) as number[];
  if (validos.length === 0) return 0;
  return Math.round((validos.reduce((a, b) => a + b, 0) / validos.length) * 100) / 100;
}

const reducirPuntosDia = (lecturas: any[], campo: string) => {
  const porHora: Record<string, any> = {};
  lecturas.forEach(l => {
    const fecha = new Date(l.timestamp.endsWith('Z') ? l.timestamp : l.timestamp + 'Z');
    const hora = Math.floor(fecha.getHours() / 2) * 2;
    const key = `${String(hora).padStart(2, '0')}:00`;
    porHora[key] = l;
  });
  return Object.entries(porHora).map(([hora, l]) => ({ x: hora, y: l[campo] ?? 0 }));
};

const reducirPuntosMes = (lecturas: any[], campo: string) => {
  const porSemana: Record<string, number[]> = {};
  lecturas.forEach(l => {
    const fecha = new Date(l.timestamp.endsWith('Z') ? l.timestamp : l.timestamp + 'Z');
    const semana = Math.ceil(fecha.getDate() / 7);
    const key = `Sem ${semana}`;
    if (!porSemana[key]) porSemana[key] = [];
    if (l[campo] !== null) porSemana[key].push(l[campo]);
  });
  return Object.entries(porSemana).map(([sem, valores]) => ({
    x: sem,
    y: Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 100) / 100,
  }));
};

const reducirPuntosAno = (lecturas: any[], campo: string) => {
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const porMes: Record<string, number[]> = {};
  lecturas.forEach(l => {
    const fecha = new Date(l.timestamp.endsWith('Z') ? l.timestamp : l.timestamp + 'Z');
    const key = meses[fecha.getMonth()];
    if (!porMes[key]) porMes[key] = [];
    if (l[campo] !== null) porMes[key].push(l[campo]);
  });
  return Object.entries(porMes).map(([mes, valores]) => ({
    x: mes,
    y: Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 100) / 100,
  }));
};

// ── Hook ───────────────────────────────────────────────────────
export function useHistorial(periodo: Periodo) {
  const [lecturas, setLecturas] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const dispositivo = await obtenerDispositivo();
        if (!dispositivo) {
          setError('Sin dispositivo');
          return;
        }
        const { data } = await client.get(
          `/readings/device/${dispositivo.id}/history?periodo=${periodo}`
        );
        setLecturas(data);
      } catch (e: any) {
        console.log('Error cargando historial:', e.response?.data);
        setError('Error cargando historial');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [periodo]);

  const promedios = {
    ph:          promedio(lecturas.map(l => l.ph)),
    temperatura: promedio(lecturas.map(l => l.temperature)),
    turbidez:    promedio(lecturas.map(l => l.turbidity)),
    solido:      promedio(lecturas.map(l => l.tds)),
  };

  const datosGrafica = {
    ph:          periodo === 'dia' ? reducirPuntosDia(lecturas, 'ph')          : periodo === 'mes' ? reducirPuntosMes(lecturas, 'ph')          : reducirPuntosAno(lecturas, 'ph'),
    temperatura: periodo === 'dia' ? reducirPuntosDia(lecturas, 'temperature') : periodo === 'mes' ? reducirPuntosMes(lecturas, 'temperature') : reducirPuntosAno(lecturas, 'temperature'),
    turbidez:    periodo === 'dia' ? reducirPuntosDia(lecturas, 'turbidity')   : periodo === 'mes' ? reducirPuntosMes(lecturas, 'turbidity')   : reducirPuntosAno(lecturas, 'turbidity'),
    solido:      periodo === 'dia' ? reducirPuntosDia(lecturas, 'tds')         : periodo === 'mes' ? reducirPuntosMes(lecturas, 'tds')         : reducirPuntosAno(lecturas, 'tds'),
  };

  return { lecturas, loading, error, promedios, datosGrafica };
}
import { useState, useEffect, useRef } from 'react';
import { obtenerDispositivo } from '../services/deviceService';
import { obtenerToken } from '../services/authService';
import { obtenerAlertasHoy, obtenerAlertasSemana } from '../services/alertService';
import client from '../services/api';

type Periodo = 'dia' | 'mes' | 'año';
type EstadoDia = 'verde' | 'amarillo' | 'rojo' | 'vacio';

function promedio(valores: (number | null)[]): number {
  const validos = valores.filter(v => v !== null) as number[];
  if (validos.length === 0) return 0;
  return Math.round((validos.reduce((a, b) => a + b, 0) / validos.length) * 100) / 100;
}

const RANGOS = {
  ph:          { min: 6.5, max: 9.0 },
  temperature: { min: 0,   max: 30  },
  turbidity:   { min: 0,   max: 2   },
  tds:         { min: 0,   max: 500 },
};

const RANGOS_CRITICOS = {
  ph:          { min: 5.5, max: 10.0 },
  temperature: { min: 0,   max: 35   },
  turbidity:   { min: 0,   max: 5    },
  tds:         { min: 0,   max: 700  },
};

function calcularEstadoDia(lecturasDelDia: any[]): EstadoDia {
  if (lecturasDelDia.length === 0) return 'vacio';

  let fueraDeRangoNormal   = 0;
  let fueraDeRangoCritico  = 0;

  for (const l of lecturasDelDia) {
    for (const campo of Object.keys(RANGOS) as (keyof typeof RANGOS)[]) {
      const val = l[campo];
      if (val === null || val === undefined) continue;

      const rangoNormal  = RANGOS[campo];
      const rangoCritico = RANGOS_CRITICOS[campo];

      if (val < rangoCritico.min || val > rangoCritico.max) {
        fueraDeRangoCritico++;
      } else if (val < rangoNormal.min || val > rangoNormal.max) {
        fueraDeRangoNormal++;
      }
    }
  }

  if (fueraDeRangoCritico >= 1 || fueraDeRangoNormal > 2) return 'rojo';
  if (fueraDeRangoNormal >= 1) return 'amarillo';
  return 'verde';
}

// ── Convierte timestamp UTC a hora local Colombia ──────────────
const toLocalDate = (ts: string): Date => {
  const f = new Date(ts.endsWith('Z') ? ts : ts + 'Z');
  f.setHours(f.getHours() - 5); // UTC-5 Colombia
  return f;
};

const reducirPuntosDia = (lecturas: any[], campo: string) => {
  const porHora: Record<string, any> = {};
  lecturas.forEach(l => {
    const fecha = toLocalDate(l.timestamp);
    const hora = Math.floor(fecha.getHours() / 2) * 2;
    const key = `${String(hora).padStart(2, '0')}:00`;
    porHora[key] = l;
  });
  return Object.entries(porHora).map(([hora, l]) => ({ x: hora, y: l[campo] ?? 0 }));
};

const reducirPuntosMes = (lecturas: any[], campo: string) => {
  const porSemana: Record<string, number[]> = {};
  lecturas.forEach(l => {
    const fecha = toLocalDate(l.timestamp);
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
    const fecha = toLocalDate(l.timestamp);
    const key = meses[fecha.getMonth()];
    if (!porMes[key]) porMes[key] = [];
    if (l[campo] !== null) porMes[key].push(l[campo]);
  });
  return Object.entries(porMes).map(([mes, valores]) => ({
    x: mes,
    y: Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 100) / 100,
  }));
};

export function useHistorial(periodo: Periodo) {
  const [lecturas, setLecturas]             = useState<any[]>([]);
  const [lecturasSemana, setLecturasSemana] = useState<any[]>([]);
  const [alertas, setAlertas]               = useState<any[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const wsRef                               = useRef<WebSocket | null>(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const dispositivo = await obtenerDispositivo();
      if (!dispositivo) { setError('Sin dispositivo'); return; }

      const [{ data }, semanaData, alertasData] = await Promise.all([
        client.get(`/readings/device/${dispositivo.id}/history?periodo=${periodo}`),
        client.get(`/readings/device/${dispositivo.id}/history?periodo=mes`),
        periodo === 'dia' ? obtenerAlertasHoy() : obtenerAlertasSemana(),
      ]);

      setLecturas(data);
      setLecturasSemana(semanaData.data);
      setAlertas(alertasData);
    } catch (e: any) {
      console.log('Error cargando historial:', e.response?.data);
      setError('Error cargando historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [periodo]);

  useEffect(() => {
    let mounted = true;

    const escucharWs = async () => {
      const [token, dispositivo] = await Promise.all([
        obtenerToken(),
        obtenerDispositivo(),
      ]);
      if (!token || !dispositivo) return;

      const ws = new WebSocket(`ws://192.168.1.4:8000/ws/device/${dispositivo.id}`);
      wsRef.current = ws;
      ws.onopen = () => ws.send(JSON.stringify({ token }));
      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.event === 'nueva_lectura' || data.event === 'nueva_alerta') {
          if (mounted) cargar();
        }
      };
      ws.onclose = () => {
        setTimeout(() => { if (mounted) escucharWs(); }, 5000);
      };
    };

    escucharWs();

    return () => {
      mounted = false;
      wsRef.current?.close();
    };
  }, [periodo]);

  const promedios = {
    ph:          promedio(lecturas.map(l => l.ph)),
    temperatura: promedio(lecturas.map(l => l.temperature)),
    turbidez:    promedio(lecturas.map(l => l.turbidity)),
    solido:      promedio(lecturas.map(l => l.tds)),
  };

  // ── Semáforo usando lecturas de la semana en hora local ────────
  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const semaforo: { dia: string; estado: EstadoDia }[] = diasSemana.map((dia, i) => {
    const hoy = new Date();
    const horaLocal = new Date(hoy.getTime() - 5 * 60 * 60 * 1000); // hora local Colombia
    const diaSemana = horaLocal.getDay() === 0 ? 6 : horaLocal.getDay() - 1;
    const diff = i - diaSemana;
    const fecha = new Date(horaLocal);
    fecha.setDate(horaLocal.getDate() + diff);

    const lecturasDelDia = lecturasSemana.filter(l => {
      const f = toLocalDate(l.timestamp);
      return f.getDate() === fecha.getDate() &&
             f.getMonth() === fecha.getMonth() &&
             f.getFullYear() === fecha.getFullYear();
    });
    return { dia, estado: calcularEstadoDia(lecturasDelDia) };
  });

  const diasPerfectos = semaforo.filter(d => d.estado === 'verde').length;
  const diasMalos     = semaforo.filter(d => d.estado === 'rojo').length;

  const mesesNombres = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const mesesMalos = mesesNombres.filter(mes => {
    const lecturasDelMes = lecturas.filter(l => {
      const f = toLocalDate(l.timestamp);
      return mesesNombres[f.getMonth()] === mes;
    });
    return calcularEstadoDia(lecturasDelMes) === 'rojo';
  }).length;

  const resumenTexto = alertas.length === 0
    ? 'Tu agua estuvo en perfecto estado. No se detectaron anomalías.'
    : alertas.length === 1
    ? 'Se detectó 1 alerta. Revisa los parámetros para mantener la calidad del agua.'
    : alertas.length <= 3
    ? `Se detectaron ${alertas.length} alertas. Te recomendamos revisar el sistema de filtración.`
    : alertas.length <= 6
    ? `Se detectaron ${alertas.length} alertas. Es recomendable realizar una limpieza pronto.`
    : `Se detectaron ${alertas.length} alertas. Se recomienda mantenimiento con urgencia.`;

  const datosGrafica = {
    ph:          periodo === 'dia' ? reducirPuntosDia(lecturas, 'ph')          : periodo === 'mes' ? reducirPuntosMes(lecturas, 'ph')          : reducirPuntosAno(lecturas, 'ph'),
    temperatura: periodo === 'dia' ? reducirPuntosDia(lecturas, 'temperature') : periodo === 'mes' ? reducirPuntosMes(lecturas, 'temperature') : reducirPuntosAno(lecturas, 'temperature'),
    turbidez:    periodo === 'dia' ? reducirPuntosDia(lecturas, 'turbidity')   : periodo === 'mes' ? reducirPuntosMes(lecturas, 'turbidity')   : reducirPuntosAno(lecturas, 'turbidity'),
    solido:      periodo === 'dia' ? reducirPuntosDia(lecturas, 'tds')         : periodo === 'mes' ? reducirPuntosMes(lecturas, 'tds')         : reducirPuntosAno(lecturas, 'tds'),
  };

  return { lecturas, loading, error, promedios, datosGrafica, alertas, semaforo, diasPerfectos, diasMalos, mesesMalos, resumenTexto };
}
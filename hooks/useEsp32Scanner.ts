import { useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { registrarDispositivo } from '../services/deviceService';

const IDENTIFY_PATH   = '/identify';
const TIMEOUT_MS      = 1500;
const BATCH_SIZE      = 10;
const AQUA_DEVICE_KEY = 'aqua_device_ip';

export type ScanStatus = 'idle' | 'scanning' | 'found' | 'not_found' | 'error';

export interface UseEsp32ScannerReturn {
  status: ScanStatus;
  progress: number;
  deviceIp: string | null;
  errorMessage: string | null;
  startScan: () => Promise<void>;
  cancelScan: () => void;
}

async function getNetworkPrefix(): Promise<string | null> {
  try {
    const ip = await Network.getIpAddressAsync();
    console.log('IP del celular:', ip);
    if (!ip || ip === '0.0.0.0') return null;
    const parts = ip.split('.');
    if (parts.length !== 4) return null;
    const prefix = `${parts[0]}.${parts[1]}.${parts[2]}`;
    console.log('Prefijo detectado:', prefix);
    return prefix;
  } catch (e) {
    console.log('Error obteniendo IP:', e);
    return null;
  }
}

async function isAquaDevice(ip: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`http://${ip}${IDENTIFY_PATH}`, {
      method: 'GET',
      signal: controller.signal,
    });
    if (!res.ok) return false;
    const json = await res.json();
    return json?.device === 'aqua';
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export function useEsp32Scanner(): UseEsp32ScannerReturn {
  const [status, setStatus]             = useState<ScanStatus>('idle');
  const [progress, setProgress]         = useState(0);
  const [deviceIp, setDeviceIp]         = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const cancelledRef                    = useRef(false);

  const cancelScan = useCallback(() => {
    cancelledRef.current = true;
    setStatus('idle');
    setProgress(0);
  }, []);

  const startScan = useCallback(async () => {
    cancelledRef.current = false;
    setStatus('scanning');
    setProgress(0);
    setDeviceIp(null);
    setErrorMessage(null);

    try {
      const prefix = await getNetworkPrefix();
      if (!prefix) {
        setStatus('error');
        setErrorMessage('No se detectó la red Wi-Fi. Verifica tu conexión.');
        return;
      }

      const TOTAL = 254;

      for (let base = 1; base <= TOTAL; base += BATCH_SIZE) {
        if (cancelledRef.current) return;

        const batch = Array.from(
          { length: Math.min(BATCH_SIZE, TOTAL - base + 1) },
          (_, i) => base + i
        );

        console.log(`Escaneando ${prefix}.${base} - ${prefix}.${base + BATCH_SIZE - 1}`);

        const results = await Promise.all(
          batch.map(async (n) => {
            const ip = `${prefix}.${n}`;
            const found = await isAquaDevice(ip);
            if (found) console.log('¡Aqua encontrado en:', ip);
            return found ? ip : null;
          })
        );

        if (cancelledRef.current) return;

        const found = results.find((r) => r !== null) ?? null;

        if (found) {
          try {
            await AsyncStorage.setItem(AQUA_DEVICE_KEY, found);
            await registrarDispositivo(found);
            console.log('Dispositivo registrado en BD con IP:', found);
          } catch (e) {
            console.log('Error registrando dispositivo en BD:', e);
          }
          setDeviceIp(found);
          setStatus('found');
          setProgress(100);
          return;
        }

        setProgress(Math.min(Math.round(((base + BATCH_SIZE - 1) / TOTAL) * 100), 99));
      }

      setStatus('not_found');
    } catch (e: any) {
      console.log('Error en scan:', e);
      setStatus('error');
      setErrorMessage(e?.message ?? 'Error inesperado durante el escaneo.');
    }
  }, []);

  return { status, progress, deviceIp, errorMessage, startScan, cancelScan };
}

export async function getSavedDeviceIp(): Promise<string | null> {
  return AsyncStorage.getItem(AQUA_DEVICE_KEY);
}
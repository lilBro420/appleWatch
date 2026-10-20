import { useState, useEffect } from 'react';
import { getBatteryStatus } from 'react-native-watch-face';

export interface BatteryStatus {
  level: number;          // 0-100
  charging: boolean;
  supported: boolean;     // true si el sensor fue detectado
  isHardware: boolean;    // true si el dato proviene del sensor físico de hardware
}

/**
 * Hook que lee el sensor de batería REAL del dispositivo móvil.
 * Cero controles manuales:
 * - En app nativa: lee del sistema operativo (Android BatteryManager / iOS UIDevice).
 * - En web móvil: lee de navigator.getBattery().
 *   Nota técnica: Google Chrome para Android requiere HTTPS (Secure Context) para
 *   permitir a las páginas web acceder al sensor de batería por seguridad.
 */
export function useBattery(): BatteryStatus {
  const [level, setLevel] = useState<number>(100);
  const [charging, setCharging] = useState<boolean>(false);
  const [supported, setSupported] = useState<boolean>(false);
  const [isHardware, setIsHardware] = useState<boolean>(false);

  useEffect(() => {
    let batteryRef: any = null;
    let pollInterval: any = null;

    const checkRealBattery = async () => {
      try {
        const status = await getBatteryStatus();
        if (status && status.supported) {
          setLevel(status.level);
          setCharging(status.charging);
          setSupported(true);
          setIsHardware(true);
        }
      } catch (e) {
        console.warn('[useBattery] Error al consultar hardware nativo:', e);
      }
    };

    const syncWebBattery = (bat: any) => {
      const pct = Math.round(bat.level * 100);
      setLevel(pct);
      setCharging(Boolean(bat.charging));
      setSupported(true);
      setIsHardware(true);
    };

    // 1. Probar primero vía método nativo / API
    checkRealBattery();

    // 2. Si estamos en Web, registrar listeners en tiempo real de la Battery API
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any)
        .getBattery()
        .then((bat: any) => {
          batteryRef = bat;
          syncWebBattery(bat);

          bat.addEventListener('levelchange', () => syncWebBattery(bat));
          bat.addEventListener('chargingchange', () => syncWebBattery(bat));
        })
        .catch((err: any) => {
          console.warn('[useBattery] La API de batería fue restringida por el navegador:', err);
        });
    }

    // Polling regular cada 3 segundos para mantener la sincronización física activa
    pollInterval = setInterval(() => {
      if (batteryRef) {
        syncWebBattery(batteryRef);
      } else {
        checkRealBattery();
      }
    }, 3000);

    // Re-sincronizar cuando el usuario regresa a la app o toca la pantalla
    const handleActive = () => {
      if (batteryRef) syncWebBattery(batteryRef);
      else checkRealBattery();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('visibilitychange', handleActive);
      window.addEventListener('focus', handleActive);
      window.addEventListener('touchstart', handleActive, { passive: true });
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('visibilitychange', handleActive);
        window.removeEventListener('focus', handleActive);
        window.removeEventListener('touchstart', handleActive);
      }
    };
  }, []);

  return {
    level,
    charging,
    supported,
    isHardware,
  };
}

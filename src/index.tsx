import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-watch-face' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const WatchFace = NativeModules.WatchFace
  ? NativeModules.WatchFace
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export interface BatteryStatusResult {
  level: number;
  charging: boolean;
  supported: boolean;
}

export function addWatchFace(path: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    console.log('[react-native-watch-face] Web preview: addWatchFace simulated for:', path);
    return Promise.resolve(true);
  }
  return WatchFace.addWatchFace(path);
}

/**
 * Consulta el sensor físico de batería del dispositivo móvil (Android / iOS / Web).
 */
export async function getBatteryStatus(): Promise<BatteryStatusResult> {
  if (Platform.OS === 'web') {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      try {
        const bat: any = await (navigator as any).getBattery();
        return {
          level: Math.round(bat.level * 100),
          charging: Boolean(bat.charging),
          supported: true,
        };
      } catch {
        // Fallback
      }
    }
    return { level: 100, charging: false, supported: false };
  }

  try {
    return await WatchFace.getBatteryStatus();
  } catch {
    return { level: 100, charging: false, supported: false };
  }
}

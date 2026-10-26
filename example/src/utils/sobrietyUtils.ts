import type { Milestone, TimeElapsed } from '../types';

export const TRACKER_COLORS = [
  '#30D158', // Verde esmeralda (salud / vida)
  '#0A84FF', // Azul serenidad
  '#BF5AF2', // Púrpura sabiduría
  '#FF9F0A', // Ámbar energía
  '#FF375F', // Rosa fuerza
  '#64D2FF', // Celeste calma
];

export const TRACKER_PRESETS = [
  { title: 'Alcohol', tag: 'ALC', color: '#30D158' },
  { title: 'Tabaco / Nicotina', tag: 'NIC', color: '#0A84FF' },
  { title: 'Apuestas / Juego', tag: 'JUE', color: '#FF9F0A' },
  { title: 'Azúcar Refinada', tag: 'AZU', color: '#FF375F' },
  { title: 'Redes Sociales', tag: 'RED', color: '#BF5AF2' },
  { title: 'Sustancias', tag: 'SUS', color: '#64D2FF' },
];

export const SOBRIETY_MILESTONES: Milestone[] = [
  { days: 1, label: '24 Horas', badge: '1D', chipColor: '#E5E7EB' }, // Ficha blanca
  { days: 3, label: '3 Días', badge: '3D', chipColor: '#FEF08A' },
  { days: 7, label: '1 Semana', badge: '1S', chipColor: '#93C5FD' }, // Ficha plateada/azul
  { days: 14, label: '2 Semanas', badge: '2S', chipColor: '#A7F3D0' },
  { days: 30, label: '1 Mes', badge: '1M', chipColor: '#FCA5A5' }, // Ficha roja
  { days: 60, label: '2 Meses', badge: '2M', chipColor: '#FDE047' }, // Ficha dorada
  { days: 90, label: '3 Meses', badge: '3M', chipColor: '#6EE7B7' }, // Ficha verde
  { days: 180, label: '6 Meses', badge: '6M', chipColor: '#67E8F9' }, // Ficha zafiro
  { days: 365, label: '1 Año', badge: '1A', chipColor: '#FBBF24' }, // Ficha de oro
];

export function calculateElapsed(startDateStr: string, now: Date): TimeElapsed {
  const start = new Date(startDateStr);
  const diffMs = now.getTime() - start.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
  };
}

export function formatFullDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getNextMilestone(currentDays: number): { next: Milestone | null; prevDays: number; progressPct: number } {
  const next = SOBRIETY_MILESTONES.find((m) => m.days > currentDays) || null;
  if (!next) {
    return { next: null, prevDays: 365, progressPct: 100 };
  }

  const prevMilestone = [...SOBRIETY_MILESTONES].reverse().find((m) => m.days <= currentDays);
  const prevDays = prevMilestone ? prevMilestone.days : 0;
  const range = next.days - prevDays;
  const currentInRange = currentDays - prevDays;
  const progressPct = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));

  return { next, prevDays, progressPct };
}

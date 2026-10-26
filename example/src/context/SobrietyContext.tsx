import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { SobrietyTracker, BibleVerse, SponsorContact } from '../types';
import { getRandomVerse } from '../services/bibleService';

interface SobrietyContextValue {
  trackers: SobrietyTracker[];
  activeTracker: SobrietyTracker | null;
  now: Date;
  selectTracker: (id: string) => void;
  cycleNextTracker: () => void;
  resetTracker: (id: string) => void;
  updateStartDate: (id: string, newDateIso: string) => void;
  addTracker: (
    title: string,
    category: string,
    startDate: string,
    color: string,
    tag: string
  ) => void;
  deleteTracker: (id: string) => void;

  // Estado de Emergencia / Recaída sincronizado
  isRelapseActive: boolean;
  relapseVerse: BibleVerse | null;
  isVerseLoading: boolean;
  sponsor: SponsorContact;
  isCallingSponsor: boolean;
  triggerRelapseSOS: () => Promise<void>;
  dismissRelapseSOS: () => void;
  startCallSponsor: () => void;
  endCallSponsor: () => void;
  fetchNewVerse: () => Promise<void>;
}

const SobrietyContext = createContext<SobrietyContextValue | null>(null);

const DEFAULT_SPONSOR: SponsorContact = {
  name: 'Carlos Mendoza',
  role: 'Padrino / Mentor de Sobriedad',
  phone: '+52 55 4190 2831',
};

// Fechas iniciales por defecto (hace 42 días para Alcohol, 18 días para Tabaco, 5 días para Azúcar)
const createInitialTrackers = (): SobrietyTracker[] => {
  const now = new Date();
  const dateAlcohol = new Date(now.getTime() - 42 * 86400000 - 14 * 3600000 - 25 * 60000);
  const dateTabaco = new Date(now.getTime() - 18 * 86400000 - 6 * 3600000);
  const dateAzucar = new Date(now.getTime() - 5 * 86400000 - 18 * 3600000);

  return [
    {
      id: 'tracker-alcohol',
      title: 'Alcohol',
      category: 'Bebidas',
      startDate: dateAlcohol.toISOString(),
      color: '#30D158',
      tag: 'ALC',
      pledge: 'Un día a la vez, por mi salud y bienestar.',
    },
    {
      id: 'tracker-tabaco',
      title: 'Tabaco / Nicotina',
      category: 'Salud Pulmonar',
      startDate: dateTabaco.toISOString(),
      color: '#0A84FF',
      tag: 'NIC',
      pledge: 'Respirar limpio y con claridad.',
    },
    {
      id: 'tracker-azucar',
      title: 'Azúcar Refinada',
      category: 'Alimentación',
      startDate: dateAzucar.toISOString(),
      color: '#FF9F0A',
      tag: 'AZU',
      pledge: 'Energía constante y enfoque.',
    },
  ];
};

export const SobrietyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trackers, setTrackers] = useState<SobrietyTracker[]>(createInitialTrackers);
  const [activeId, setActiveId] = useState<string>('tracker-alcohol');
  const [now, setNow] = useState<Date>(new Date());

  // Estados de Asistencia por Recaída
  const [isRelapseActive, setIsRelapseActive] = useState<boolean>(false);
  const [relapseVerse, setRelapseVerse] = useState<BibleVerse | null>(null);
  const [isVerseLoading, setIsVerseLoading] = useState<boolean>(false);
  const [sponsor] = useState<SponsorContact>(DEFAULT_SPONSOR);
  const [isCallingSponsor, setIsCallingSponsor] = useState<boolean>(false);

  // Actualiza la hora cada segundo para cálculo exacto de días, horas, minutos y segundos
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeTracker = useMemo(
    () => trackers.find((t) => t.id === activeId) ?? trackers[0] ?? null,
    [trackers, activeId]
  );

  const selectTracker = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const cycleNextTracker = useCallback(() => {
    if (trackers.length === 0) return;
    const idx = trackers.findIndex((t) => t.id === activeTracker?.id);
    const nextIdx = (idx + 1) % trackers.length;
    setActiveId(trackers[nextIdx].id);
  }, [trackers, activeTracker]);

  const resetTracker = useCallback((id: string) => {
    const freshDate = new Date().toISOString();
    setTrackers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, startDate: freshDate } : t))
    );
  }, []);

  const updateStartDate = useCallback((id: string, newDateIso: string) => {
    setTrackers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, startDate: newDateIso } : t))
    );
  }, []);

  const addTracker = useCallback(
    (
      title: string,
      category: string,
      startDate: string,
      color: string,
      tag: string
    ) => {
      const id = `tracker-${Date.now()}`;
      const newTracker: SobrietyTracker = {
        id,
        title: title.trim(),
        category: category.trim() || 'General',
        startDate: startDate || new Date().toISOString(),
        color,
        tag: tag.toUpperCase().slice(0, 4) || 'META',
      };
      setTrackers((prev) => [...prev, newTracker]);
      setActiveId(id);
    },
    []
  );

  const deleteTracker = useCallback(
    (id: string) => {
      setTrackers((prev) => {
        const filtered = prev.filter((t) => t.id !== id);
        if (activeId === id && filtered.length > 0) {
          setActiveId(filtered[0].id);
        }
        return filtered;
      });
    },
    [activeId]
  );

  const fetchNewVerse = useCallback(async () => {
    setIsVerseLoading(true);
    try {
      const v = await getRandomVerse();
      setRelapseVerse(v);
    } catch (e) {
      console.warn('Error fetching verse:', e);
    } finally {
      setIsVerseLoading(false);
    }
  }, []);

  const triggerRelapseSOS = useCallback(async () => {
    setIsRelapseActive(true);
    await fetchNewVerse();
  }, [fetchNewVerse]);

  const dismissRelapseSOS = useCallback(() => {
    setIsRelapseActive(false);
    setIsCallingSponsor(false);
  }, []);

  const startCallSponsor = useCallback(() => {
    setIsCallingSponsor(true);
  }, []);

  const endCallSponsor = useCallback(() => {
    setIsCallingSponsor(false);
  }, []);

  const value = useMemo(
    () => ({
      trackers,
      activeTracker,
      now,
      selectTracker,
      cycleNextTracker,
      resetTracker,
      updateStartDate,
      addTracker,
      deleteTracker,
      isRelapseActive,
      relapseVerse,
      isVerseLoading,
      sponsor,
      isCallingSponsor,
      triggerRelapseSOS,
      dismissRelapseSOS,
      startCallSponsor,
      endCallSponsor,
      fetchNewVerse,
    }),
    [
      trackers,
      activeTracker,
      now,
      selectTracker,
      cycleNextTracker,
      resetTracker,
      updateStartDate,
      addTracker,
      deleteTracker,
      isRelapseActive,
      relapseVerse,
      isVerseLoading,
      sponsor,
      isCallingSponsor,
      triggerRelapseSOS,
      dismissRelapseSOS,
      startCallSponsor,
      endCallSponsor,
      fetchNewVerse,
    ]
  );

  return (
    <SobrietyContext.Provider value={value}>
      {children}
    </SobrietyContext.Provider>
  );
};

export function useSobriety(): SobrietyContextValue {
  const ctx = useContext(SobrietyContext);
  if (!ctx) {
    throw new Error('useSobriety debe usarse dentro de un SobrietyProvider');
  }
  return ctx;
}

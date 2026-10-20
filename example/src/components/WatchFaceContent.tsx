import React from 'react';
import type { PokemonInfo, WatchTheme } from '../types';
import { WatchFaceDial, type SubdialContent } from './WatchFaceDial';
import { useBattery, type BatteryStatus } from '../hooks/useBattery';

interface WatchFaceContentProps {
  theme: WatchTheme;
  pokemon: PokemonInfo | null;
  loading: boolean;
  battery?: BatteryStatus;
}

/**
 * Conector para la pantalla Smartwatch.
 * Sincroniza la información de la PokeAPI con los sensores de hardware del dispositivo.
 */
export const WatchFaceContent: React.FC<WatchFaceContentProps> = ({
  theme,
  pokemon,
  loading,
  battery: propBattery,
}) => {
  const now = new Date();
  const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  const formattedDate = `${days[now.getDay()]} ${now.getDate().toString().padStart(2, '0')} ${months[now.getMonth()]}`;

  // Lectura en tiempo real del sensor de batería del hardware o la prop compartida
  const hookBattery = useBattery();
  const battery = propBattery || hookBattery;

  const getSpriteUrl = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  // 1. MONITOR PRINCIPAL DE POKÉMON (Sprite y Nombre)
  const subdial12: SubdialContent = {
    header: pokemon ? `#${pokemon.id.toString().padStart(3, '0')} • ${theme.name}` : theme.name,
    title: pokemon ? pokemon.name : 'Cargando...',
    value: pokemon ? `${pokemon.hp} HP` : '-- HP',
    imageUrl: pokemon?.sprite || (pokemon ? getSpriteUrl(pokemon.id) : undefined),
    gaugePercent: battery.level,
  };

  // 2. SENSOR DE ATAQUE
  const subdial3: SubdialContent = {
    header: 'ATK',
    title: 'ATAQUE',
    value: pokemon ? `${pokemon.attack}` : '--',
    gaugePercent: pokemon ? Math.min(100, pokemon.attack) : 75,
  };

  // 3. SENSOR DE VELOCIDAD
  const subdial6: SubdialContent = {
    header: 'SPD',
    title: 'VELOCIDAD',
    value: pokemon ? `${pokemon.speed}` : '--',
    dateText: formattedDate,
    gaugePercent: pokemon ? Math.min(100, pokemon.speed) : 70,
  };

  // 4. SENSOR DE ENERGÍA / BATERÍA
  const subdial9: SubdialContent = {
    header: 'BAT',
    title: 'BATERÍA',
    value: battery.charging ? 'CHG' : 'OK',
    gaugePercent: battery.level,
  };

  return (
    <WatchFaceDial
      accentColor={theme.accentColor}
      watermarkImage={pokemon?.image}
      subdial12={subdial12}
      subdial3={subdial3}
      subdial6={subdial6}
      subdial9={subdial9}
      signatureText={`POKÉDEX ULTRA • ${theme.name}`}
      loading={loading}
      batteryLevel={battery.level}
      batteryCharging={battery.charging}
      batterySupported={battery.supported}
      isHardware={battery.isHardware}
    />
  );
};

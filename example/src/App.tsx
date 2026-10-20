import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import type { ElementType } from './types';
import { WATCH_THEMES } from './constants/themes';
import { usePokemonWatchData } from './hooks/usePokemonWatchData';
import { useBattery } from './hooks/useBattery';
import { AppleWatchChassis } from './components/AppleWatchChassis';
import { WatchFaceContent } from './components/WatchFaceContent';
import { ThemeSelector } from './components/ThemeSelector';

export default function App() {
  const [currentType, setCurrentType] = useState<ElementType>('fire');
  const currentTheme = WATCH_THEMES[currentType];
  const [currentPokemonId, setCurrentPokemonId] = useState<number>(currentTheme.defaultPokemonId);

  // Hook desacoplado para las peticiones a PokeAPI
  const { pokemon, loading } = usePokemonWatchData(currentPokemonId);

  // Sensor de batería del dispositivo
  const battery = useBattery();

  // Cambiar tipo elemental (Fuego, Agua, Planta)
  const handleSelectType = (newType: ElementType) => {
    setCurrentType(newType);
    setCurrentPokemonId(WATCH_THEMES[newType].defaultPokemonId);
  };

  // Cambiar Pokémon por ID específico
  const handleSelectPokemon = (id: number) => {
    setCurrentPokemonId(id);
  };

  // Selección aleatoria dentro del tipo activo
  const handleRandomPokemon = () => {
    const list = currentTheme.pokemonList;
    const candidates = list.filter((p) => p.id !== currentPokemonId);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)] || list[0];
    setCurrentPokemonId(chosen.id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0E14" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            EDICIÓN <Text style={{ color: currentTheme.accentColor }}>{currentTheme.name}</Text>
          </Text>
        </View>

        {/* Chassis oficial del Apple Watch */}
        <AppleWatchChassis accentColor={currentTheme.accentColor}>
          <WatchFaceContent
            theme={currentTheme}
            pokemon={pokemon}
            loading={loading}
            battery={battery}
          />
        </AppleWatchChassis>

        {/* Panel de Controles y Selector de Temas */}
        <ThemeSelector
          currentType={currentType}
          onSelectType={handleSelectType}
          currentPokemonId={currentPokemonId}
          onSelectPokemon={handleSelectPokemon}
          onRandomPokemon={handleRandomPokemon}
          pokemon={pokemon}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0E14',
    minHeight: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 36,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import type { ElementType, PokemonInfo } from '../types';
import { WATCH_THEMES } from '../constants/themes';

interface ThemeSelectorProps {
  currentType: ElementType;
  onSelectType: (type: ElementType) => void;
  currentPokemonId: number;
  onSelectPokemon: (id: number) => void;
  onRandomPokemon: () => void;
  pokemon?: PokemonInfo | null;
  onInstallWatchFace?: () => void;
  installing?: boolean;
  installResult?: string | null;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentType,
  onSelectType,
  currentPokemonId,
  onSelectPokemon,
  onRandomPokemon,
}) => {
  const currentTheme = WATCH_THEMES[currentType];
  const types: ElementType[] = ['fire', 'water', 'grass'];

  return (
    <View style={styles.container}>
      {/* 1. Selector de los 3 Relojes Temáticos */}
      <View style={styles.typeTabsContainer}>
        {types.map((typeKey) => {
          const theme = WATCH_THEMES[typeKey];
          const isSelected = currentType === typeKey;
          return (
            <TouchableOpacity
              key={typeKey}
              activeOpacity={0.8}
              onPress={() => onSelectType(typeKey)}
              style={[
                styles.typeTab,
                isSelected && {
                  borderColor: theme.accentColor,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  shadowColor: theme.accentColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                  elevation: 4,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabTitle,
                  isSelected && { color: theme.accentColor, fontWeight: '800' },
                ]}
              >
                {theme.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2. Barra de Selección y Botón Aleatorio */}
      <View style={styles.pickerHeaderRow}>
        <Text style={styles.sectionTitle}>
          COLECCIÓN ({currentTheme.pokemonList.length})
        </Text>
        <TouchableOpacity
          style={[styles.randomButton, { borderColor: currentTheme.accentColor }]}
          onPress={onRandomPokemon}
          activeOpacity={0.7}
        >
          <Text style={[styles.randomButtonText, { color: currentTheme.accentColor }]}>
            SELECCIÓN ALEATORIA
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista Horizontal de Pokémon */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pokemonScroll}
      >
        {currentTheme.pokemonList.map((item) => {
          const isSelected = currentPokemonId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onSelectPokemon(item.id)}
              style={[
                styles.pokemonPill,
                isSelected && {
                  backgroundColor: currentTheme.accentColor,
                  borderColor: currentTheme.accentColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.pokemonPillText,
                  isSelected && { color: '#FFFFFF', fontWeight: '800' },
                ]}
              >
                #{item.id} {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 440,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    alignItems: 'center',
  },
  typeTabsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  typeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#161B22',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#30363D',
  },
  tabTitle: {
    color: '#8B949E',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  pickerHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#8B949E',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  randomButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  randomButtonText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  pokemonScroll: {
    paddingRight: 8,
    gap: 8,
    marginBottom: 16,
  },
  pokemonPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#161B22',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  pokemonPillText: {
    color: '#C9D1D9',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

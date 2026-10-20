export type ElementType = 'fire' | 'water' | 'grass';

export const POKEMON_ELEMENTS: ElementType[] = ['fire', 'water', 'grass'];

export interface PokemonItem {
  id: number;
  name: string;
}

export interface PokemonInfo {
  id: number;
  name: string;
  genus: string; // e.g. "Pokémon Llama"
  flavorText: string;
  image: string; // Arte oficial en alta resolución
  sprite?: string; // Pixel sprite para tarjetas y miniaturas
  hp: number;
  attack: number;
  speed: number;
}

export interface WatchTheme {
  type: ElementType;
  name: string;
  tagline: string;
  accentColor: string;
  secondaryColor: string;
  glowColor: string;
  dialHandColor: string;
  defaultPokemonId: number;
  pokemonList: PokemonItem[];
  statLabel: string;
  statUnit: string;
}

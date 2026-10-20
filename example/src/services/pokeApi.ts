import type { PokemonInfo } from '../types';

// Fallback rápido con imágenes oficiales de PokeAPI
const FALLBACK_DATA: Record<number, PokemonInfo> = {
  6: {
    id: 6,
    name: 'Charizard',
    genus: 'Pokémon Llama',
    flavorText: 'Escupe un fuego tan caliente que funde las rocas más duras.',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
    hp: 78,
    attack: 84,
    speed: 100,
  },
  9: {
    id: 9,
    name: 'Blastoise',
    genus: 'Pokémon Armazón',
    flavorText: 'Lanza chorros de agua a presión por los cañones de su caparazón.',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',
    hp: 79,
    attack: 83,
    speed: 78,
  },
  3: {
    id: 3,
    name: 'Venusaur',
    genus: 'Pokémon Semilla',
    flavorText: 'La flor de su lomo absorbe los rayos del sol y los transforma en energía.',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
    hp: 80,
    attack: 82,
    speed: 80,
  },
};

export async function fetchPokemonData(idOrName: number | string): Promise<PokemonInfo> {
  const numericId = typeof idOrName === 'number' ? idOrName : parseInt(idOrName, 10);
  const fallback = FALLBACK_DATA[numericId] || {
    id: numericId || 1,
    name: typeof idOrName === 'string' ? idOrName : `Pokemon #${idOrName}`,
    genus: 'Pokémon Místico',
    flavorText: 'Un compañero leal con increíbles poderes elementales.',
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numericId || 1}.png`,
    hp: 85,
    attack: 90,
    speed: 85,
  };

  try {
    // 1. Llamada al endpoint de especies solicitado
    const speciesPromise = fetch(`https://pokeapi.co/api/v2/pokemon-species/${idOrName}/`)
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);

    // 2. Llamada al endpoint de detalles (para stats y arte oficial)
    const pokemonPromise = fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}/`)
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);

    const [speciesData, pokemonData] = await Promise.all([speciesPromise, pokemonPromise]);

    if (!speciesData && !pokemonData) {
      return fallback;
    }

    // Extraer género / categoría en español si está disponible
    let genus = fallback.genus;
    if (speciesData?.genera) {
      const esGenus = speciesData.genera.find((g: any) => g.language.name === 'es');
      const enGenus = speciesData.genera.find((g: any) => g.language.name === 'en');
      genus = esGenus?.genus || enGenus?.genus || genus;
    }

    // Extraer descripción en español
    let flavorText = fallback.flavorText;
    if (speciesData?.flavor_text_entries) {
      const esEntry = speciesData.flavor_text_entries.find(
        (f: any) => f.language.name === 'es'
      );
      const enEntry = speciesData.flavor_text_entries.find(
        (f: any) => f.language.name === 'en'
      );
      const text = esEntry?.flavor_text || enEntry?.flavor_text;
      if (text) {
        flavorText = text.replace(/[\n\f]/g, ' ');
      }
    }

    const officialArtwork =
      pokemonData?.sprites?.other?.['official-artwork']?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idOrName}.png`;

    const sprite =
      pokemonData?.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idOrName}.png`;

    const hp = pokemonData?.stats?.find((s: any) => s.stat.name === 'hp')?.base_stat || fallback.hp;
    const attack = pokemonData?.stats?.find((s: any) => s.stat.name === 'attack')?.base_stat || fallback.attack;
    const speed = pokemonData?.stats?.find((s: any) => s.stat.name === 'speed')?.base_stat || fallback.speed;

    const formattedName = speciesData?.names
      ? speciesData.names.find((n: any) => n.language.name === 'es')?.name ||
        speciesData.name.charAt(0).toUpperCase() + speciesData.name.slice(1)
      : pokemonData?.name
      ? pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)
      : fallback.name;

    return {
      id: speciesData?.id || pokemonData?.id || fallback.id,
      name: formattedName,
      genus,
      flavorText,
      image: officialArtwork,
      sprite,
      hp,
      attack,
      speed,
    };
  } catch (error) {
    console.warn('Error fetching from PokeAPI, using fallback:', error);
    return fallback;
  }
}

import { useState, useEffect } from 'react';
import type { PokemonInfo } from '../types';
import { fetchPokemonData } from '../services/pokeApi';

/**
 * Hook exclusivo para gestionar las llamadas a la PokeAPI.
 * Desacopla la lógica de red de la presentación visual de la carátula.
 */
export function usePokemonWatchData(pokemonId: number) {
  const [pokemon, setPokemon] = useState<PokemonInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchPokemonData(pokemonId)
      .then((data) => {
        if (isMounted) {
          setPokemon(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('[usePokemonWatchData] Error fetching pokemon:', err);
          setError('Error al consultar PokeAPI');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pokemonId]);

  return { pokemon, loading, error };
}

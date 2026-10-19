import { useState } from 'react'
import './App.css'
import { getRandomPokemon, getType } from './services/pokeApi'
import PokemonCard from './components/PokemonCard/PokemonCard';
import { battle } from './utils/battle/battle';

function App() {
  const [pair, setPair] = useState({ previous: null, current: null });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleLoad = async () => {
    setLoading(true);

    try {
      const previous = pair.current;
      const next = await getRandomPokemon();

      if (previous) {
        const previousType = previous.types[0];
        const currentType = next.types[0];

        const [currentRelations, previousRelations] = await Promise.all([
          getType(currentType),
          getType(previousType)
        ]);

        const relations = {
          [currentType]: currentRelations,
          [previousType]: previousRelations
        };

        setResult(battle(previousType, currentType, relations));
      } else {
        setResult(null);
      };

      setPair({ previous, current: next });
    } catch (e) {

      console.error(e);

    } finally {

      setLoading(false);
    };
  };

  return (
    <div>
      <div>
        <button onClick={handleLoad} disabled={loading}>Load Pokémon</button>

        <PokemonCard pokemon={pair.previous} placeholder='No previous Pokémon' />
        <h2>{result}</h2>
        <PokemonCard pokemon={pair.current} placeholder='Press the button to load a Pokémon' />
      </div>
    </div>
  );
};

export default App;
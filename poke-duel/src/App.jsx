import { useState } from 'react'
import './App.css'
import { getRandomPokemon, getType } from './services/pokeApi'
import PokemonCard from './components/PokemonCard/PokemonCard';
import { battle, NEW_WINS, PREVIOUS_WINS, TYPE_MATCH } from './utils/battle/battle';

function App() {
  const [pair, setPair] = useState({ previous: null, current: null });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [matches, setMatches] = useState(0);
  const [newWins, setNewWins] = useState(0);
  const [previousWins, setPreviousWins] = useState(0);

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

        const outcome = battle(previousType, currentType, relations);
        setResult(outcome);

        if (outcome === TYPE_MATCH) {
          setMatches(matches + 1);
        } else if (outcome === NEW_WINS) {
          setNewWins(newWins + 1);
        } else if (outcome === PREVIOUS_WINS) {
          setPreviousWins(previousWins + 1);
        };
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
        <p>Matches: {matches} | New wins: {newWins} | Previous wins: {previousWins}</p>
        <button onClick={handleLoad} disabled={loading}>Load Pokémon</button>

        <div className='arena'>
          <PokemonCard pokemon={pair.previous} placeholder='No previous Pokémon' />
          <h2>{result}</h2>
          <PokemonCard pokemon={pair.current} placeholder='Press the button to load a Pokémon' />
        </div>
      </div>
    </div>
  );
};

export default App;
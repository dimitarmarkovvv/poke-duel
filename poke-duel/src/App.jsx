import { useState, useCallback, useMemo } from 'react';
import './App.css';
import { getRandomPokemon, getType } from './services/pokeApi';
import PokemonCard from './components/PokemonCard/PokemonCard';
import { battle, NEW_WINS, PREVIOUS_WINS, TYPE_MATCH } from './utils/battle/battle';
import Controls from './components/Controls/Controls';
import Counters from './components/Counters/Counters';

function App() {
  const [pair, setPair] = useState({ previous: null, latest: null });
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [result, setResult] = useState(null);
  const [matches, setMatches] = useState(0);
  const [newWins, setNewWins] = useState(0);
  const [previousWins, setPreviousWins] = useState(0);

  const handleLoad = useCallback(async () => {
    setLoading(true);
    setShaking(true);
    setTimeout(() => setShaking(false), 800);

    try {
      const previous = pair.latest;
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
          setMatches((n) => n +  1);
        } else if (outcome === NEW_WINS) {
          setNewWins((n) => n +  1);
        } else if (outcome === PREVIOUS_WINS) {
          setPreviousWins((n) => n +  1);
        };
      } else {
        setResult(null);
      };

      setPair({previous,latest: next});
    } catch (e) {

      console.error(e);

    } finally {

      setLoading(false);
    };
  }, [pair.latest]);

  const stats = useMemo(() => ({
    matches,
    newWins,
    previousWins
  }), [matches,newWins,previousWins]);

  const previousStatus =
    result === PREVIOUS_WINS ? 'winner' : result === NEW_WINS ? 'loser' : null;

  const latestStatus =
    result === NEW_WINS ? 'winner' : result === PREVIOUS_WINS ? 'loser' : null;

  return (
    <div className="app">
      <header>
        <h1 className="title">Poke <span>Duel</span></h1>
        <p className="subtitle">Load a pokemon and see who wins the type matchup</p>
      </header>

      <Counters stats={stats} />

      <Controls onLoad={handleLoad} loading={loading} />

      <div className={shaking ? 'arena arena-shaking' : 'arena'}>
        <PokemonCard
          pokemon={pair.previous}
          placeholder='No previous Pokémon'
          status={previousStatus}
        />

        <div className="verdict">
          <p className="vs">VS</p>
          {result && <p className="verdict-text">{result}</p>}
        </div>

        <PokemonCard
          pokemon={pair.latest}
          placeholder='Press the button to load a Pokémon'
          status={latestStatus}
        />
      </div>
    </div>
  );
};

export default App;
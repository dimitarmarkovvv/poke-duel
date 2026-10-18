import { useState } from 'react'
import './App.css'
import { getRandomPokemon } from './services/pokeApi'
import PokemonCard from './components/PokemonCard/PokemonCard';
function App() {
  const [pair, setPair] = useState({ previous: null, current: null });
  const [loading, setLoading] = useState(false);

  const handleLoad = async () => {
    setLoading(true);

    try {
      const next = await getRandomPokemon();
      setPair(prev => ({
        previous: prev.current,
        current: next
      }));
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

        <PokemonCard pokemon={pair.previous} placeholder='No previous Pokémon'/>
        <PokemonCard pokemon={pair.current} placeholder='Press the button to load a Pokémon'/>
      </div>
    </div>
  );
};

export default App;
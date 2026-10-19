import { memo } from "react";

function PokemonCard({pokemon, placeholder = 'No Pokémon yet'}) {
    return (
        <div>
            {pokemon ? (
                <div>
                    {pokemon.types.join(', ')}
                    <h2>{pokemon.name}</h2>
                    <img src={pokemon.image} alt={`${pokemon.name} sprite`} />
                    <p>{pokemon.height} m</p>
                    <p>{pokemon.weight} kg</p>
                </div>
            ) : (
                <p>{placeholder}</p>
            )}
        </div>)
}

export default memo(PokemonCard);
function PokemonCard({pokemon}) {
    return (
        <div>
            {pokemon ? (
                <div>
                    {pokemon.types.join(', ')}
                    <h2>{pokemon.name}</h2>
                    <img src={pokemon.image} alt='img' />
                    <p>{pokemon.height} m</p>
                    <p>{pokemon.weight} kg</p>
                </div>
            ) : (
                <p>Press the button to load a Pokémon.</p>
            )}
        </div>)
}

export default PokemonCard;
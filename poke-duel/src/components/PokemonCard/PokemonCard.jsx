import { memo } from "react";
import './PokemonCard.css';

function PokemonCard({ pokemon, placeholder = 'No Pokémon yet', status }) {
    if (!pokemon) {
        return (
            <div className="card">
                <div className="card-inner card-inner-empty">
                    <p className="card-empty">{placeholder}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`card frame-${pokemon.types[0]}${status ? ` card-${status}` : ''}`}>
            <div className="card-inner">
                <div className="card-top">
                    <span className="card-badge">Basic</span>
                    <h2 className="card-name">{pokemon.name}</h2>
                    <span className="card-number">#{pokemon.id}</span>
                </div>

                <div className="card-art">
                    <img
                        className="card-sprite"
                        src={pokemon.image}
                        alt={`${pokemon.name} sprite`}
                    />
                </div>

                <div className="card-types">
                    {pokemon.types.map((type) => (
                        <span key={type} className={`type type-${type}`}>
                            {type}
                        </span>
                    ))}
                </div>

                <div className="card-stats">
                    <p className="card-stat">HT {pokemon.height} m</p>
                    <p className="card-stat">WT {pokemon.weight} kg</p>
                </div>
            </div>
        </div>
    );
}

export default memo(PokemonCard);
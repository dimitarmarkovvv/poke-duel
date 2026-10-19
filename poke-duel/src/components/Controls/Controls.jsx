import { memo } from "react";

function Controls({ onLoad, loading }) {
    return (
        <button onClick={onLoad} disabled={loading}>
            {loading ? 'Loading…' : 'Load Pokémon'}
        </button>
    );
}

export default memo(Controls);
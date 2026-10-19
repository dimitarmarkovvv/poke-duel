import { memo } from "react";
import './Controls.css';

function Controls({ onLoad, loading }) {
    return (
        <button className="load-button" onClick={onLoad} disabled={loading}>
            {loading ? 'Loading…' : 'Load Pokémon'}
        </button>
    );
};

export default memo(Controls);
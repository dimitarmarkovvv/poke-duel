import { memo } from "react";
import './Counters.css';

function Counters({ stats }) {
    return (
        <div className="scoreboard">
            <div className="score score-match">
                <p className="score-label">Type matches</p>
                <p className="score-value">{stats.matches}</p>
            </div>

            <div className="score score-new">
                <p className="score-label">New wins</p>
                <p className="score-value">{stats.newWins}</p>
            </div>

            <div className="score score-previous">
                <p className="score-label">Previous wins</p>
                <p className="score-value">{stats.previousWins}</p>
            </div>
        </div>
    );
}

export default memo(Counters);
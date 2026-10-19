import { memo } from "react";

function Counters({ stats }) {
    return (
    <p>
        Matches: {stats.matches} | New wins: {stats.newWins} | Previous wins: {stats.previousWins}
    </p>
    )
}

export default memo(Counters);